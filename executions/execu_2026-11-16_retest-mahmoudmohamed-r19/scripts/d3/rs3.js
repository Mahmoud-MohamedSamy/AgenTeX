const A3 = '5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4', SK = '72f4edfe-f36a-4ac7-907e-fe7d97cd1dbf';
const g = (await api('GET', '/desk/departments/' + SK)).j.data; const before = g.agent_user_ids.length;
const r = await api('PATCH', '/desk/departments/' + SK, { name: g.name, agent_user_ids: g.agent_user_ids.filter(x => x !== A3) });
const g2 = (await api('GET', '/desk/departments/' + SK)).j.data;
LED('NDC-2850 restore fix: Dev Team 2 removed again from "QA RT19 SK Dept" (SK lane had left it with no agents at 11:46Z) -> ' + E(r) + ' members now ' + g2.agent_user_ids.length);
const w = (await api('GET', '/desk/agents/' + A3 + '/workload')).j.data;
const teams = (await api('GET', '/desk/teams')).j.data.teams.filter(t => t.department_id === SK && t.sources.some(s => s.ref_id === A3)).map(t => t.name);
return { before, r: E(r), after: g2.agent_user_ids.length, refs: w.references, skTeamsWithA3: teams };
