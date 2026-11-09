// Which conditions lose the "Workflow rule ran" history row? Each rule: same private-comment action; only the condition differs.
const out = {}; const cmt = tag => [{ type: 'AddTicketComment', commentBody: `QA WF ${tag} fired`, commentPublic: false }];
const C = (field, op, value) => ({ kind: 'Comparison', field, operator: op, negate: false, value });
const S = (field, op, v) => ({ kind: 'StringMatch', field, operator: op, stringValue: v, caseInsensitive: false });
const due = d => new Date(Date.now() + d * 864e5).toISOString();
const defs = {
  W1threads: C('threadCount', 'GreaterThanOrEqual', { kind: 'number', numberValue: 0 }),
  W2comments: C('commentCount', 'GreaterThanOrEqual', { kind: 'number', numberValue: 0 }),
  W3recent: { kind: 'Logical', operator: 'Not', operands: [S('recentComment', 'Contains', 'zzzQA')] },
  W4mixed: and(S('description', 'Contains', 'QAV2'), C('isOverdue', 'Equal', { kind: 'bool', boolValue: true })),
  W5status: S('status', 'Equal', 'Open'),
  W6contact: S('contact_id.title', 'Contains', 'QAWF-E1'),
};
for (const [tag, c] of Object.entries(defs)) out[tag] = { rule: (await mkRule(tag, { kind: 'RecordCreated' }, cmt(tag), { criteria: and(guard(`QA WF ${tag} `), c) })).s };
// edit trigger with a fact
out.W7editOd = { rule: (await mkRule('W7editOd', { kind: 'RecordUpdated' }, cmt('W7editOd'), { criteria: and(guard('QA WF W7editOd '), C('isOverdue', 'Equal', { kind: 'bool', boolValue: true })) })).s };
const extra = { W6contact: { contact_id: 'ef75e54b-34ef-4be0-9901-559747bbb303' } };
for (const tag of Object.keys(out)) out[tag].ticket = (await mkTicket(tag, { description: 'QAV2 text', due_date: due(-1), ...(extra[tag] || {}) })).id;
await sleep(4000); out.W7editOd.patch = await patchTicket(out.W7editOd.ticket, { description: 'QAV2 edited' });
await sleep(45000);
for (const tag of Object.keys(out)) { const id = out[tag].ticket; const h = arr((await api('GET', `/desk/tickets/${id}/activity`)).j?.data);
  out[tag].fired = h.filter(a => a.action === 'comment.added' && a.summary?.by_rule_name).length; out[tag].ranRow = h.filter(a => a.action === 'ticket.workflow_rule_ran').length;
  out[tag].exec = arr((await api('GET', `/workflow/executions?recordId=${id}`)).j?.data).map(e => e.outcome).join(','); out[tag].n = (await getTicket(id)).ticket_number; delete out[tag].ticket; }
return fin(out);
