const out = {};
for (const id of ['29049c30-eda1-46e8-a4b5-85ecbe4acc40', 'b8281686-ddab-41bc-9b71-2f038de4f59d']) { const t = await getTicket(id); out[id.slice(0, 8)] = { owner: t.owner, team: t.team, dept: t.department, modified: t.modified_at }; }
const h = await api('GET', '/desk/tickets/29049c30-eda1-46e8-a4b5-85ecbe4acc40/activity'); out.history = h.s + ' ' + h.t.slice(0, 900);
return fin(out);
