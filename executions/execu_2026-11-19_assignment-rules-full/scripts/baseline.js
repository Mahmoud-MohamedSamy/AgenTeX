const B = { at: new Date().toISOString() };
const deps = (await api('GET', '/desk/departments')).j.data; const DL = Array.isArray(deps) ? deps : deps.departments; B.departments = DL;
B.direct = (await api('GET', '/desk/assignment-rules?type=direct')).j;
B.notif = (await api('GET', '/desk/assignment/notification-settings')).j;
B.skillTypes = (await api('GET', '/desk/skill-types')).j;
B.teams = (await api('GET', '/desk/teams')).j;
B.perDept = {};
for (const id of [IDS.DA, IDS.DB]) { const q = 'department_id=' + id; const x = {};
  x.rr = (await api('GET', '/desk/assignment-rules?type=round_robin&' + q)).j; x.rrPrefs = (await api('GET', '/desk/departments/' + id + '/round-robin-preferences')).j;
  x.team = (await api('GET', '/desk/departments/' + id + '/team-assignment')).j; x.skills = (await api('GET', '/desk/skills?' + q)).j;
  x.skillPrefs = (await api('GET', '/desk/skill-preferences?' + q)).j; x.agentSkills = (await api('GET', '/desk/agent-skills?' + q)).j; B.perDept[id] = x; }
fs.writeFileSync(RUN + '/out/baseline.json', JSON.stringify(B, null, 1));
const d = id => DL.find(x => x.id === id) || {};
const dir = B.direct?.data?.rules || [];
return {
  depts: [IDS.DA, IDS.DB].map(id => ({ name: d(id).name, agents: (d(id).agent_user_ids || []).map(u => Object.entries(IDS).find(([k, v]) => v === u)?.[0] || u.slice(0, 8)), rr: (B.perDept[id].rr?.data?.rules || []).map(r => r.name + (r.is_active ? ' [on]' : ' [off]')), prefs: B.perDept[id].rrPrefs?.data, team: B.perDept[id].team?.data, skills: (B.perDept[id].skills?.data?.skills || B.perDept[id].skills?.data || []).length })),
  notif: B.notif?.data, directActive: dir.filter(r => r.is_active).map(r => r.name + ' | ' + JSON.stringify(r.targets?.map(t => t.criteria)).slice(0, 160)), directTotal: dir.length, rrMaster: B.notif?.data
};
