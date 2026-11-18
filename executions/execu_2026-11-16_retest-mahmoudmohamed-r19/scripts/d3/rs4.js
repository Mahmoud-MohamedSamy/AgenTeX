const A3 = '5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4';
const C = JSON.parse(fs.readFileSync(RUN + '/scripts/d3/2850.json', 'utf8'));
const o = {};
const todo = C.snap.pools.filter(p => ['QA AS6 RR seq', 'QA AS6 RR load', 'QA AS6 RR skill', 'QA RT19 SK 2931 skill TU1+DT2 xbtx'].includes(p.name));
const byDept = {}; for (const p of todo) (byDept[p.dept] = byDept[p.dept] || []).push(p);
for (const [d, ps] of Object.entries(byDept)) {
  const g = (await api('GET', '/desk/departments/' + d)).j.data; const orig = [...g.agent_user_ids];
  const need = [...new Set(ps.flatMap(p => p.targets.flatMap(t => t.pool?.user_ids || [])))].filter(u => !orig.includes(u));
  o[g.name] = { origN: orig.length, tempAdd: need.length };
  if (need.length) { const r = await api('PATCH', '/desk/departments/' + d, { name: g.name, agent_user_ids: [...orig, ...need] }); o[g.name].add = E(r); }
  for (const p of ps) {
    const c = ((await api('GET', '/desk/assignment-rules?type=round_robin&department_id=' + d)).j?.data?.rules || []).find(x => x.id === p.id);
    const r = await api('PUT', '/desk/assignment-rules/' + p.id, { type: c.type, department_id: c.department_id, name: c.name, description: c.description, is_active: c.is_active, execute_on: c.execute_on, targets: p.targets, version: c.version });
    o[g.name][p.name] = E(r) + ' active=' + c.is_active;
  }
  if (need.length) { const r2 = await api('PATCH', '/desk/departments/' + d, { name: g.name, agent_user_ids: orig }); const g2 = (await api('GET', '/desk/departments/' + d)).j.data; o[g.name].back = E(r2) + ' same=' + (JSON.stringify([...g2.agent_user_ids].sort()) === JSON.stringify([...orig].sort())); }
  LED('NDC-2850 restore: dept ' + d + ' "' + g.name + '" members temporarily +' + need.length + ' (pool users who were not members) to re-save RR pools with Dev Team 2, then put back: ' + JSON.stringify(o[g.name]));
}
const w = (await api('GET', '/desk/agents/' + A3 + '/workload')).j.data; o.refs = w.references;
return o;
