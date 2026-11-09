// Re-check "also seen" 2 and 3 with controlled pairs. Each rule adds a private comment; tickets differ only by the rule they match.
const out = {}; const cmt = tag => [{ type: 'AddTicketComment', commentBody: `QA WF ${tag} fired`, commentPublic: false }];
const C = (field, op, value) => ({ kind: 'Comparison', field, operator: op, negate: false, value });
const due = d => new Date(Date.now() + d * 864e5).toISOString();
const defs = { V2plain: null, V2desc: { kind: 'StringMatch', field: 'description', operator: 'Contains', stringValue: 'QAV2', caseInsensitive: false }, V2od: C('isOverdue', 'Equal', { kind: 'bool', boolValue: true }), V2exec: C('executionTime', 'Equal', { kind: 'string', stringValue: 'business_hours' }), V2due: C('due_date', 'LessThan', { kind: 'now' }) };
for (const [tag, c] of Object.entries(defs)) out[tag] = { rule: (await mkRule(tag, { kind: 'RecordCreated' }, cmt(tag), c ? { criteria: and(guard(`QA WF ${tag} `), c) } : undefined)).s };
for (const tag of Object.keys(defs)) out[tag].ticket = (await mkTicket(tag, { description: 'QAV2 text', due_date: due(-1) })).id;
// item 3: a real department change after create
const dc = await mkTicket('V3dept'); out.V3 = { ticket: dc.id }; await sleep(3000); out.V3.patch = await patchTicket(dc.id, { department: HR });
await sleep(60000);
for (const tag of Object.keys(defs)) { const id = out[tag].ticket; const h = arr((await api('GET', `/desk/tickets/${id}/activity`)).j?.data);
  out[tag].hist = h.map(a => a.action + (a.summary?.by_rule_name ? '[' + a.summary.by_rule_name + ']' : '')).join(', ');
  out[tag].exec = arr((await api('GET', `/workflow/executions?recordId=${id}`)).j?.data).map(e => (e.outcome || e.status)).join(','); out[tag].n = (await getTicket(id)).ticket_number; }
out.V3.hist = arr((await api('GET', `/desk/tickets/${dc.id}/activity`)).j?.data).filter(a => /department/.test(a.action)).map(a => a.action + ' ' + JSON.stringify(a.summary));
out.V3.n = (await getTicket(dc.id)).ticket_number;
return fin(out);
