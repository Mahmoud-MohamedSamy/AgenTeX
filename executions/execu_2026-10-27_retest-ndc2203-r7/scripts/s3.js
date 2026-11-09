const R = {}; const cmt = tag => [{ type: 'AddTicketComment', commentBody: `QA WF ${tag} fired`, commentPublic: false }];
const r = await mkRule('A4in', { kind: 'TicketEvent', ticketEvents: { events: ['private_thread'], privateThreads: 'incoming' } }, cmt('A4in'));
R.create = r; if (r.id) R.saved = (await api('GET', `/workflow/rules/${r.id}`)).j?.data?.trigger;
return fin(R);
