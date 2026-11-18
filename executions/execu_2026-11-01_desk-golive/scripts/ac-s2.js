const N = { B: '3445ec4a', C: '9d182dfa', D: '876ce871', E: '23f0f9d7', O: '97be04b6' };
const ds = D((await api('GET', '/desk/departments?limit=60')).j); const L = ds.items || ds; out.m = {};
for (const d of L) { const r = D((await api('GET', '/desk/departments/' + d.id)).j); const f = ids => Object.entries(N).filter(([k, v]) => (ids || []).some(x => x.startsWith(v))).map(([k]) => k).join(''); out.m[d.name] = { id: d.id, full: f(r.agent_user_ids), vo: f(r.view_only_agent_user_ids), n: (r.agent_user_ids || []).length, team: r.team_assignment_enabled, act: r.is_active }; }
out.teams = JSON.stringify(D((await api('GET', '/desk/teams')).j)).slice(0, 300);
return fin({ out });
