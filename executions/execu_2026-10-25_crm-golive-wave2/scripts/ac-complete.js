const p = await call('PATCH', `/modules/${MODS.tasks}/records/a501f43a-3e3d-4e3b-a649-9f7aaa2981e0`, { data: [{ field: 'status', value: { kind: 'string', value: 'Completed' } }] });
await new Promise(r => setTimeout(r, 15000));
const r = await call('GET', `/modules/${MODS.tasks}/records?page=1&per_page=100&sort_by=created_at&sort_dir=desc`);
const qa = (r.j.data || []).filter(x => /QA W2 AC task/.test(JSON.stringify(x))).map(x => { const v = k => ((x.data.find(e => e.field === k) || {}).value || {}).value; return x.id.slice(0, 8) + ' ' + v('status') + ' due ' + v('due_date'); });
return { patch: p.s + ' ' + (p.s >= 300 ? p.t.slice(0, 200) : ''), tasks: qa };
