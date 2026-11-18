const A3 = '5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4';
const C = JSON.parse(fs.readFileSync(RUN + '/scripts/d3/2850.json', 'utf8'));
const o = {}; const byId = {};
for (const d of new Set(C.snap.pools.map(x => x.dept))) for (const x of ((await api('GET', '/desk/assignment-rules?type=round_robin&department_id=' + d)).j?.data?.rules || [])) byId[x.id] = x;
for (const s of C.snap.pools) {
  const c = byId[s.id]; if (!c) { o[s.name] = 'missing'; continue; }
  const had = JSON.stringify(s.targets).includes(A3), has = JSON.stringify(c.targets).includes(A3);
  if (!had || has) continue;
  const r = await api('PUT', '/desk/assignment-rules/' + s.id, { type: c.type, department_id: c.department_id, name: c.name, description: c.description, is_active: c.is_active, execute_on: c.execute_on, targets: c.targets.map((t, i) => (i === 0 && t.pool && t.pool.kind === 'agents' && !t.pool.user_ids.includes(A3)) ? { ...t, pool: { ...t.pool, user_ids: [...t.pool.user_ids, A3] } } : t), version: c.version });
  o[s.name] = E(r);
  LED('NDC-2850 restore: RR rule ' + s.id + ' "' + s.name + '" pool targets restored (Dev Team 2 back), active=' + c.is_active + ' -> ' + o[s.name]);
}
const w = (await api('GET', '/desk/agents/' + A3 + '/workload')).j.data; o.refsNow = w.references; o.snapRefs = C.snap.refs;
return o;
