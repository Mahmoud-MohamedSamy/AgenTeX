const r = await mkRule('A4both', { kind: 'TicketEvent', ticketEvents: { events: ['private_thread'], privateThreads: 'any' } }, [{ type: 'AddTicketComment', commentBody: 'QA WF A4both fired', commentPublic: false }], { criteria: guard('QA WF A4 ') });
return fin({ r });
