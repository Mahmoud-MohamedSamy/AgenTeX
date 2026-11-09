const D = JSON.parse(require('fs').readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-07_retest-ndc2754/data.json', 'utf8'));
const f = await X.fields(D.tk.t0); const o = { keys: Object.keys(f).join(','), owner: f.owner, team: f.team };
const r = await api('o', 'POST', `desk:/desk/tickets/${D.tk.t0}/assign`, { owner_id: '97be04b6-0a08-4883-aa51-e1650b11cab7', team_id: null }); o.assign = X.err(r);
o.ownerAfter = (await X.fields(D.tk.t0)).owner; o.agentSeesT0 = (await api('a', 'GET', `desk:/modules/${X.TK}/records/${D.tk.t0}`)).s;
const me = (await api('a', 'GET', 'desk:/iam/me')).j?.data; o.agentProfiles = JSON.stringify(me?.profiles || me?.profile_names || me?.roles || '').slice(0, 200);
return o;
