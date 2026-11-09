const o = {}; const ids = { pacox: '876ce871-2b02-4854-89a7-68050391c62b', m2: '23f0f9d7-2fc0-429b-9334-9933fe5c429b', fed: '9d182dfa-05f3-4af7-9685-8615a2fbe537', kin: '2a7c1bc4-f6d4-4bd3-805e-0496ece13987', pob: 'e82f62cb-9904-42c7-a13c-77a7449820b9', bel: '5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4', m1: '18ba78c4-20c2-49e3-b159-55e1af2043ae' };
const deps = (await api('GET', '/desk/departments')).j.data; o.depts = deps.map(d => d.name + ':' + d.id.slice(0, 8));
const d0 = await api('GET', '/desk/departments/' + deps[0].id); o.deptKeys = Object.keys(d0.j.data || {}).join(',');
for (const [k, id] of Object.entries(ids)) { const r = await api('GET', '/desk/agents/' + id + '/departments'); o[k] = r.s + ' ' + JSON.stringify(r.j && r.j.data).slice(0, 200); }
const q = await api('POST', '/desk/agents/departments/query', { agent_ids: Object.values(ids) }); o.q = q.s + ' ' + JSON.stringify(q.j && (q.j.data || q.j.error)).slice(0, 600);
return done(o);
