const R = {}; const cmt = tag => [{ type: 'AddTicketComment', commentBody: `QA WF ${tag} fired`, commentPublic: false }];
R.delProbe = (await api('DELETE', '/workflow/rules/50102e39-42bf-4a4f-a9a1-4b935c3fd30d')).s;
const ev = d => ({ kind: 'TicketEvent', ticketEvents: { events: ['private_thread'], privateThreads: d } });
for (const [tag, d] of [['A4in', 'incoming'], ['A4out', 'outgoing'], ['A4both', 'both']]) { const r = await mkRule(tag, ev(d), cmt(tag), { criteria: guard('QA WF A4 ') }); R[tag] = { ...r, saved: r.id && (await api('GET', `/workflow/rules/${r.id}`)).j?.data?.trigger?.ticketEvents?.privateThreads }; }
R.ticket = await mkTicket('A4');
if (R.ticket.id) { const t = await getTicket(R.ticket.id); R.num = t.ticket_number || t.ticketNumber; }
return fin(R);
