const o = {}; const dl = await api('GET', '/desk/departments'); 
for (const d of arr(dl.j && dl.j.data)) { const r = await api('GET', '/desk/departments/' + d.id); const x = r.j && r.j.data || {}; const a = (x.agent_user_ids || []).includes(UC), v = (x.view_only_agent_user_ids || []).includes(UC), b = (x.agent_user_ids || []).includes(UB); if (a || v || b) o[d.name] = { C: a, C_viewOnly: v, B: b }; }
const ds = await api('GET', '/desk/data-sharing'); o.dataSharing = ds.s + ' ' + ds.t.slice(0, 300);
const g = await api('GET', '/desk/tickets/30bb8716-cd9a-4e0b-8d49-8a2aa67db1d6'); o.csTicket = g.s + ' ' + (g.j && g.j.data ? g.j.data.department_id + ' ' + g.j.data.ticket_number : '');
return fin(o);
