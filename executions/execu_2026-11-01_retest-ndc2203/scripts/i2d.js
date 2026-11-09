const out = {}; const cmt = tag => [{ type: 'AddTicketComment', commentBody: `QA WF ${tag} fired`, commentPublic: false }];
const C = (field, op, value) => ({ kind: 'Comparison', field, operator: op, negate: false, value });
const defs = { X1threads: C('threadCount', 'GreaterThanOrEqual', { kind: 'int', intValue: 0 }), X2comments: C('commentCount', 'GreaterThanOrEqual', { kind: 'int', intValue: 0 }), X3status: C('status', 'Equal', { kind: 'string', stringValue: 'Open' }), X4priority: { kind: 'Logical', operator: 'Not', operands: [C('priority', 'Equal', { kind: 'string', stringValue: 'High' })] } };
for (const [tag, c] of Object.entries(defs)) { out[tag] = { rule: (await mkRule(tag, { kind: 'RecordCreated' }, cmt(tag), { criteria: and(guard(`QA WF ${tag} `), c) })).s }; }
for (const tag of Object.keys(out)) out[tag].ticket = (await mkTicket(tag)).id;
await sleep(45000);
for (const tag of Object.keys(out)) { const id = out[tag].ticket; const h = arr((await api('GET', `/desk/tickets/${id}/activity`)).j?.data);
  out[tag].fired = h.filter(a => a.action === 'comment.added' && a.summary?.by_rule_name).length; out[tag].ranRow = h.filter(a => a.action === 'ticket.workflow_rule_ran').length; out[tag].n = (await getTicket(id)).ticket_number; delete out[tag].ticket; }
return fin(out);
