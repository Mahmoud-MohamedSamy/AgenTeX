const A = 'b8941829-5e08-43e1-b8e0-89c33bb9903c'; const o = {};
const d = (await api('o', 'GET', `desk:/desk/departments/${A}`)).j?.data;
for (const m of ['PATCH', 'PUT']) { const r = await api('o', m, `desk:/desk/departments/${A}`, { name: d.name, description: d.description, visibility: d.visibility, routing_strategy: d.routing_strategy, is_active: d.is_active, agent_user_ids: [] }); o[m] = r.s + ' ' + (r.t || '').slice(0, 200); if (r.s < 300) break; }
o.after = ((await api('o', 'GET', `desk:/desk/departments/${A}`)).j?.data?.agent_user_ids || []).length;
const r = await api('o', 'DELETE', `desk:/desk/departments/${A}`); o.del = r.s + ' ' + (r.t || '').slice(0, 200);
return o;
