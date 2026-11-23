// Read-only discovery of ids needed by the action cases.
const g = async p => { const r = await api('GET', p); return { s: r.s, d: r.j && r.j.data !== undefined ? r.j.data : null }; };
const out = {};
const users = await g('/iam/users?take=200'); out.users = arr(users.d).filter(u => u.status !== 'suspended').map(u => ({ id: u.id, name: u.displayName || u.name || ((u.firstName || '') + ' ' + (u.lastName || '')), org: u.orgUnitId, profile: u.profileId, st: u.status })).slice(0, 40);
const dept = await g('/desk/departments/' + DEPT); out.deptMembers = dept.d && (dept.d.member_user_ids || dept.d.agent_ids || Object.keys(dept.d));
const dept2 = await g('/desk/departments/' + DEPT2); out.dept2Members = dept2.d && (dept2.d.member_user_ids || dept2.d.agent_ids || Object.keys(dept2.d));
out.orgUnits = arr((await g('/iam/org-units')).d).map(o => ({ id: o.id, name: o.name })).slice(0, 20);
out.profiles = arr((await g('/iam/profiles')).d).map(o => ({ id: o.id, name: o.name })).slice(0, 20);
out.teams = arr((await g('/desk/teams?department_id=' + DEPT)).d).map(o => ({ id: o.id, name: o.name, members: o.member_user_ids || o.members }));
out.tags = arr((await g('/desk/tags?department_id=' + DEPT)).d).map(o => ({ id: o.id, name: o.name })).slice(0, 20);
out.skills = arr((await g('/desk/skills?department_id=' + DEPT)).d).map(o => ({ id: o.id, name: o.name, crit: !!o.criteria })).slice(0, 20);
const st = await g('/settings/batch?keys=desk.email_templates'); out.templatesRaw = st.s;
out.assignmentRules = arr((await g('/workflow/assignment-rules?moduleId=' + T)).d).map(o => ({ id: o.id, name: o.name, active: o.isActive })).slice(0, 10);
out.taskModule = arr((await g('/modules')).d).filter(m => /task|contact|account/i.test(m.moduleKey)).map(m => ({ id: m.id, key: m.moduleKey, app: m.appKey }));
fs.writeFileSync(RUN + '/out/disc.json', JSON.stringify(out, null, 1));
return { users: out.users.length, deptMembers: out.deptMembers, dept2Members: out.dept2Members, orgUnits: out.orgUnits.length, profiles: out.profiles.length, teams: out.teams, tags: out.tags.length, skills: out.skills, ar: out.assignmentRules, mods: out.taskModule };
