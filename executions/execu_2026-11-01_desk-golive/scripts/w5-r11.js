const deps = await api('GET', '/desk/departments'); const dl = arr(D(deps.j)); out.deps = dl.map(d => d.name + '=' + d.id);
const cs = dl.find(d => /Customer Support/.test(d.name));
const t = await api('GET', '/desk/tickets?limit=1&department_id=' + cs.id); out.tmeta = JSON.stringify(t.j && t.j.meta).slice(0, 300); out.tkeys = Object.keys(D(t.j) || {}).slice(0, 10);
for (const st of ['Open', 'Closed']) { const r = await api('GET', '/desk/tickets?limit=1&department_id=' + cs.id + '&status=' + st); out['n_' + st] = JSON.stringify(r.j && r.j.meta).slice(0, 200); }
const rl = await api('GET', '/reporting/reports?limit=50'); out.reports = arr(D(D(rl.j))).filter(r => /QA GL W5/.test(r.name)).map(r => r.name + '=' + r.id + ' ' + r.created_at);
return fin({ out });
