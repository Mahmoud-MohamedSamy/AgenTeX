// Batch 2: Ticket Event triggers + Field Changed on 3 fields (Any / All). Each rule adds a private comment naming itself.
const R = {}; const cmt = tag => [{ type: 'AddTicketComment', commentBody: `QA WF ${tag} fired`, commentPublic: false }];
const ev = (events, x) => ({ kind: 'TicketEvent', ticketEvents: { events, ...(x || {}) } });
R.A2 = { rule: await mkRule('A2', ev(['agent_response']), cmt('A2')) };
R.A3 = { rule: await mkRule('A3', ev(['comment'], { comments: 'public' }), cmt('A3')) };
R.A4 = { rule: await mkRule('A4', ev(['private_thread']), cmt('A4')) };
R.D3any = { rule: await mkRule('D3any', { kind: 'SpecificFieldChanged', fieldNames: ['description', 'resolution', 'language'], fieldMatch: 'any' }, cmt('D3any')) };
R.D3all = { rule: await mkRule('D3all', { kind: 'SpecificFieldChanged', fieldNames: ['description', 'resolution', 'language'], fieldMatch: 'all' }, cmt('D3all')) };
for (const t of ['A2', 'A3', 'A4', 'D3any', 'D3all']) R[t].ticket = await mkTicket(t);
return fin(R);
