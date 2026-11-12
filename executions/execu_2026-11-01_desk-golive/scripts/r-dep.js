const o = {};
for (const [k, d] of [['mkt', DQ], ['cs', DCS]]) { const r = await api('GET', '/desk/departments/' + d); const t = r.t; o[k] = { s: r.s, keys: r.j && r.j.data ? Object.keys(r.j.data).join(',') : '', hasB: (await api('GET', '/desk/departments/' + d)).t.includes(UB) }; }
for (const p of [`/desk/departments/${DQ}/members`, `/desk/departments/${DQ}/agents?limit=200`, `/desk/agents?department_id=${DQ}&limit=200`, `/desk/agents?limit=300`]) { const r = await api('GET', p); o[p] = r.s + ' B:' + r.t.includes(UB) + ' C:' + r.t.includes(UC) + ' ' + r.t.slice(0, 160); }
return fin(o);
