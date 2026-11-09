const T = '88e8ea44-1658-4df3-9930-d0902b91073d'; const id = '853bf3cd-8b44-4dd2-b3cf-cb02cdcbe4bd';
const g = await api('GET', '/modules/' + T + '/records/' + id); const o = {}; for (const d of g.j?.data?.data || []) o[d.field] = d.value?.value ?? d.value;
const h = arr((await api('GET', '/desk/tickets/' + id + '/activity')).j?.data).slice(0, 4).map(a => a.action + ' ' + a.occurred_at.slice(11, 19) + ' ' + JSON.stringify(a.summary || '').slice(0, 100));
const r = await api('POST', '/desk/tickets/' + id + '/assign', { owner_id: null, team_id: null });
return { before: { owner: o.owner, team: o.team }, h, unassign: r.s };
