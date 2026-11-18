const CS = '7e1ac409-58b0-41ab-97e1-0e7d5c8c5158'; const Du = '876ce871-2b02-4854-89a7-68050391c62b', Eu = '23f0f9d7-2fc0-429b-9334-9933fe5c429b';
const P = id => '44444444-4444-4444-4444-444444444' + id;
const f = D((await api('GET', '/modules/' + TM + '/fields')).j); out.teamFields = (f.items || f).map(x => x.apiName).filter(n => /team|owner|share|depart/i.test(n));
const cs = D((await api('GET', '/desk/departments/' + CS)).j); out.csOrig = cs.agent_user_ids; out.csVoOrig = cs.view_only_agent_user_ids;

const add = [...new Set([...cs.agent_user_ids, Du, Eu])];
const put = await api('PUT', '/desk/departments/' + CS + '/agents', { agent_user_ids: add, view_only_agent_user_ids: cs.view_only_agent_user_ids || [] }); out.put = put.s + ' ' + put.t.slice(0, 200);
const after = D((await api('GET', '/desk/departments/' + CS)).j); out.csAfter = after.agent_user_ids; out.csVoAfter = after.view_only_agent_user_ids;
out.dUser = (await api('GET', '/iam/users/' + Du)).t.slice(0, 500);
const a1 = await api('POST', '/iam/users/' + Du + '/profiles', { profile_id: P('402') }); out.addAgent = a1.s + ' ' + a1.t.slice(0, 200);
if (a1.s < 300) { const d1 = await api('DELETE', '/iam/users/' + Du + '/profiles/' + P('404')); out.delSup = d1.s + ' ' + d1.t.slice(0, 200); }
out.dUser2 = (await api('GET', '/iam/users/' + Du)).t.slice(0, 500);
const t = await api('POST', '/desk/teams', { name: 'QA AC Team', description: 'access run 17 Nov, delete after', department_id: CS, sources: [{ kind: 'agent', ref_id: Du }], color: 'blue', icon: 'star' }); out.team = t.s + ' ' + t.t.slice(0, 400); if (D(t.j) && D(t.j).id) CREATED.push({ kind: 'team', id: D(t.j).id, name: 'QA AC Team' });
return fin({ out });
