const out = {};
for (const p of ['/desk/activities', '/desk/activities/stats', '/desk/activities/reports', '/desk/activities/count', '/desk/tasks/count', '/desk/tickets/count']) { const r = await api('GET', p); out[p] = r.s; }
const tl = await api('GET', '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records?limit=1');
out.ticketSample = tl.s; const t = arr(tl.j && tl.j.data)[0] || arr(tl.j)[0]; out.tkeys = t && Object.keys(t).slice(0, 60);
if (t) { const id = t.id; for (const p of [`/desk/tickets/${id}/activities`, `/desk/tickets/${id}/counts`, `/desk/tickets/${id}/count`, `/desk/tickets/${id}`]) { const r = await api('GET', p); out[p.replace(id, '{id}')] = r.s + ' ' + r.t.slice(0, 300); } }
return out;
