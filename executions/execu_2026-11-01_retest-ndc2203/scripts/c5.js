const out = {};
for (const id of ['29049c30-eda1-46e8-a4b5-85ecbe4acc40', 'b8281686-ddab-41bc-9b71-2f038de4f59d']) out[id.slice(0, 8)] = arr((await api('GET', `/workflow/executions?recordId=${id}`)).j?.data).map(e => JSON.stringify(e).replace(/,"[a-zA-Z]+":null/g, '').slice(0, 700));
const d = (await api('GET', '/desk/departments')).j?.data.find(x => x.id === CS); out.csRouting = { routing: d.routing_strategy, keys: Object.keys(d).join(',') };
return fin(out);
