const T = '88e8ea44-1658-4df3-9930-d0902b91073d'; const id = '853bf3cd-8b44-4dd2-b3cf-cb02cdcbe4bd';
const g = await api('GET', `/modules/${T}/records/${id}`); const o = {}; for (const x of g.j?.data?.data || []) o[x.field] = x.value?.value ?? x.value;
const h = arr((await api('GET', `/desk/tickets/${id}/activity`)).j?.data).map(a => a.action + ' ' + a.occurred_at.slice(11, 23) + ' ' + JSON.stringify(a.summary || '').slice(0, 160));
return { s: g.s, n: o.ticket_number, d: o.description, owner: o.owner, team: o.team, h };
