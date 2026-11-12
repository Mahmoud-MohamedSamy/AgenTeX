const F = '1475109000000139001', o = {};
const deps = await z('GET', '/departments?limit=50'); o.depts = (deps.j?.data||[]).map(d => [d.id, d.name, d.isEnabled]);
for (const [id, name] of o.depts) { const r = await z('GET', `/tickets?departmentId=${id}&assignee=${F}&status=Open,On Hold,Escalated&limit=100`); o[name] = [r.s, (r.j?.data||[]).length]; }
const rr = await z('GET', `/roundRobinPreferences?departmentId=${DEPT}`); o.rr = [rr.s, rr.t.slice(0, 300)];
return o;
