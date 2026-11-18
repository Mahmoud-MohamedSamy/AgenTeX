const A3 = '5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4';
const CF = RUN + '/scripts/d3/2850.json'; const C = JSON.parse(fs.readFileSync(CF, 'utf8'));
const o = { dept: {}, team: {} };
const w = (await api('GET', '/desk/agents/' + A3 + '/workload')).j.data; const have = new Set(w.departments.map(d => d.department_id));
for (const d of C.snap.depts) {
  const g = (await api('GET', '/desk/departments/' + d)).j?.data; if (!g) { o.dept[d.slice(0, 8)] = 'GET fail'; continue; }
  if ((g.agent_user_ids || []).includes(A3)) { o.dept[d.slice(0, 8)] = 'already'; continue; }
  const r = await api('PATCH', '/desk/departments/' + d, { name: g.name, agent_user_ids: [...g.agent_user_ids, A3] });
  const g2 = (await api('GET', '/desk/departments/' + d)).j?.data; o.dept[g.name] = E(r) + ' now=' + (g2.agent_user_ids || []).includes(A3);
  LED('NDC-2850 restore: Dev Team 2 re-added to department ' + d + ' "' + g.name + '" -> ' + o.dept[g.name]);
}
const teams = (await api('GET', '/desk/teams')).j.data.teams;
for (const st of C.snap.teams) {
  const cur = teams.find(t => t.id === st.id); if (!cur) { o.team[st.name] = 'missing'; continue; }
  if ((cur.sources || []).some(s => s.ref_id === A3)) { o.team[st.name] = 'already'; continue; }
  const r = await api('PUT', '/desk/teams/' + st.id, { name: cur.name, description: cur.description, department_id: cur.department_id, sources: st.sources, color: cur.color, icon: cur.icon });
  const t2 = ((await api('GET', '/desk/teams')).j.data.teams).find(t => t.id === st.id);
  o.team[st.name] = E(r) + ' now=' + (t2.sources || []).some(s => s.ref_id === A3) + ' same=' + (JSON.stringify(t2.sources) === JSON.stringify(st.sources));
  LED('NDC-2850 restore: team ' + st.id + ' "' + st.name + '" sources restored -> ' + o.team[st.name]);
}
return o;
