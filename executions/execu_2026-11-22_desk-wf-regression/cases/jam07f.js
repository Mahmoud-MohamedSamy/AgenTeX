const RID = '88639ae2-d25d-4495-978b-673ebcba32a3', MYROLE = '7972984b-b5cc-034a-bd96-6de61e3937d0';
const rule = (await allRules()).find(r => r.id === RID); const act = rule.actions.find(a => a.type === 'OwnerAssignment');
const orgs = arr((await api('GET', '/iam/org-units?take=500')).j?.data); const nm = id => (orgs.find(o => (o.orgUnitId || o.id) === id) || {}).name || id;
const us = arr((await api('GET', '/iam/users?take=200')).j?.data);
const ces = us.filter(u => /Customer Experience Specialist/i.test(u.displayName || ''));
const out = { ruleOwnerValue: act.ownerValue + ' = ' + nm(act.ownerValue), ces: ces.map(u => ({ name: u.displayName, role: nm(u.orgUnitId), profiles: u.profileNames, status: u.status })) };
out.myRole = { name: nm(MYROLE), members: us.filter(u => u.orgUnitId === MYROLE).map(u => u.displayName + ' | ' + JSON.stringify(u.profileNames)) };
out.supervisorMembers = us.filter(u => u.orgUnitId === act.ownerValue).map(u => u.displayName);
// who are the agents of the two departments
for (const [n, id] of [['Customer Support', null], ['QA AO Dept B', DEPT2]]) { const d = id || (arr((await api('GET', '/desk/departments')).j?.data).find(x => x.name === n) || {}).id; const r = await api('GET', `/desk/departments/${d}`); const j = r.j?.data || {}; out['dept ' + n] = Object.keys(j).filter(k => /agent|member|user/i.test(k)).map(k => k + ':' + JSON.stringify(j[k]).slice(0, 200)).join(' | ') || r.s; }
return out;
