const o = {}; const T='88e8ea44-1658-4df3-9930-d0902b91073d';
for (const id of ['31feced6-4027-4a6b-9dc3-8b5f934e0609','7b0ba6f0-6d2d-4c87-9605-65e21cc97b8d']) { const r = await api('GET','/desk/departments/'+id); const d = r.j && r.j.data; o[id.slice(0,8)] = d ? { name: d.name, agents: d.agent_user_ids.length, tickets: d.ticket_count, active: d.is_active, created_by: d.created_by, created: d.created_at } : r.s; }
return o;
