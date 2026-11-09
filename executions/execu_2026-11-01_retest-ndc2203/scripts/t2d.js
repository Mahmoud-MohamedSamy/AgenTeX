const id = '715841e8-7bf0-4d54-b5f0-e1df82d974d5'; const t = await getTicket(id);
const h = arr((await api('GET', `/desk/tickets/${id}/activity`)).j?.data);
return { read: (await api('GET', `/modules/${T}/records/${id}`)).s, number: t.ticket_number, team: t.team ? String(t.team).slice(0, 8) : null, owner: t.owner || null, ranRows: h.filter(a => a.action === 'ticket.workflow_rule_ran').length, actions: h.map(a => a.action).slice(0, 10) };
