// NDC-2203 fix 2 — the three rules from t2 with corrected condition shapes (int value, Status as Comparison).
const out = {}; const cmt = tag => [{ type: 'AddTicketComment', commentBody: `QA WF ${tag} fired`, commentPublic: false }];
const C = (field, op, value) => ({ kind: 'Comparison', field, operator: op, negate: false, value });
const due = d => new Date(Date.now() + d * 864e5).toISOString();
const defs = { Y5threads: C('threadCount', 'GreaterThanOrEqual', { kind: 'int', intValue: 0 }), Y6comments: C('commentCount', 'GreaterThanOrEqual', { kind: 'int', intValue: 0 }), Y8status: C('status', 'Equal', { kind: 'string', stringValue: 'Open' }) };
for (const [tag, c] of Object.entries(defs)) out[tag] = { rule: (await mkRule(tag, { kind: 'RecordCreated' }, cmt(tag), { criteria: and(guard(`QA WF ${tag} `), c) })).s };
for (const tag of Object.keys(out)) out[tag].ticket = (await mkTicket(tag, { description: 'QAV2 text', due_date: due(-1) })).id;
await sleep(50000);
for (const tag of Object.keys(out)) { const id = out[tag].ticket; const h = arr((await api('GET', `/desk/tickets/${id}/activity`)).j?.data);
  out[tag].commented = h.filter(a => a.action === 'comment.added' && a.summary?.by_rule_name).length; out[tag].ranRows = h.filter(a => a.action === 'ticket.workflow_rule_ran').length;
  out[tag].exec = arr((await api('GET', `/workflow/executions?recordId=${id}`)).j?.data).map(e => e.outcome).join(','); }
return fin(out);
