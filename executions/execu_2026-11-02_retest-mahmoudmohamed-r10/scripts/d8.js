// NDC-2662 (Anyware Desk): On-create rules whose condition uses rule facts (isOverdue, executionTime, recentComment, threadCount, commentCount) must write a "Workflow rule ran" row in ticket History; controls with plain fields.
const out = {}; const enc = v => v === null ? { kind: 'null' } : { kind: 'string', value: String(v) };
const TK = arr((await api('o', 'GET', 'desk:/modules')).j?.data).find(x => x.id.startsWith('e8e5e302')).id;
const DEPT = arr((await api('o', 'GET', 'desk:/desk/departments')).j?.data).find(d => /techSupport/.test(d.name)).id;
const guard = p => ({ kind: 'StringMatch', field: 'subject', operator: 'StartsWith', stringValue: p, caseInsensitive: false });
const and = (...o) => ({ kind: 'Logical', operator: 'And', operands: o });
const S = (field, op, v) => ({ kind: 'StringMatch', field, operator: op, stringValue: v, caseInsensitive: false });
const C = (field, op, value) => ({ kind: 'Comparison', field, operator: op, negate: false, value });
const cases = {
  OD: C('isOverdue', 'Equal', { kind: 'bool', boolValue: true }),
  ET: C('executionTime', 'Equal', { kind: 'string', stringValue: 'outside_business_hours' }),
  RC: { kind: 'Logical', operator: 'Not', operands: [S('recentComment', 'Contains', 'zzzQA')] },
  TH: C('threadCount', 'GreaterThanOrEqual', { kind: 'number', numberValue: 0 }),
  CC: C('commentCount', 'GreaterThanOrEqual', { kind: 'number', numberValue: 0 }),
  ODD: and(S('description', 'Contains', 'QA'), C('isOverdue', 'Equal', { kind: 'bool', boolValue: true })),
  CTRL: S('status', 'Equals', 'Open'),
};
out.rules = {};
for (const [k, cond] of Object.entries(cases)) {
  const r = await api('o', 'POST', 'desk:/workflow/rules', { moduleId: TK, appKey: 'desk', name: `QA RT r10 2662 ${k}`, isActive: true, mode: 'Recurring', trigger: { kind: 'RecordCreated' }, criteria: and(guard(`QA RT r10 2662 ${k} `), cond), actions: [{ order: 0, type: 'AddTicketComment', commentBody: `QA RT r10 2662 ${k} fired`, commentPublic: false }] });
  out.rules[k] = r.s + (r.s >= 300 ? ' ' + r.t.slice(0, 200) : ''); if (r.j?.data?.id) ledger(`desk rule ${r.j.data.id} "QA RT r10 2662 ${k}"`);
}
await sleep(3000);
const due = new Date(Date.now() - 864e5).toISOString(); out.tickets = {};
for (const k of Object.keys(cases)) {
  const r = await api('o', 'POST', `desk:/modules/${TK}/records`, { data: Object.entries({ subject: `QA RT r10 2662 ${k} ticket`, status: 'Open', department: DEPT, email: 'qa.r10.2662@example.com', channel: 'email', description: 'QA desc', due_date: due }).map(([f, v]) => ({ field: f, value: enc(v) })) });
  out.tickets[k] = r.j?.data?.id || r.t.slice(0, 200); if (r.j?.data?.id) ledger(`desk ticket ${r.j.data.id} "QA RT r10 2662 ${k} ticket"`);
}
await sleep(60000);
out.history = {};
for (const [k, id] of Object.entries(out.tickets)) { if (!/^[0-9a-f-]{36}$/.test(id)) continue;
  const h = await api('o', 'GET', `desk:/desk/tickets/${id}/activity`); const t = h.t;
  const ex = arr((await api('o', 'GET', `desk:/workflow/executions?recordId=${id}`)).j?.data).filter(e => /2662/.test(e.ruleName || '') || true).map(e => (e.outcome || e.status));
  out.history[k] = { s: h.s, ruleRanRow: /Workflow rule ran|workflow_rule_ran|rule_ran/i.test(t), commentByRule: /by workflow rule|2662 .* fired/i.test(t), exec: ex.join(',') };
}
return out;
