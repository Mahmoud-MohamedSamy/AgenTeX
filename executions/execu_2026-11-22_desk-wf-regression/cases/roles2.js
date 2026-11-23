const us = arr((await api('GET', '/iam/users?take=200&app_key=desk')).j?.data);
const orgs = arr((await api('GET', '/iam/org-units?take=500')).j?.data).filter(o => /^desk/.test(o.path || '')); const id = o => o.orgUnitId || o.id;
const rn = x => (orgs.find(o => id(o) === x) || {}).name || x;
const deptB = ['5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4', '876ce871-2b02-4854-89a7-68050391c62b', '97be04b6-0a08-4883-aa51-e1650b11cab7'];
return { deskRoles: orgs.map(o => o.name + ': ' + us.filter(u => u.orgUnitId === id(o)).map(u => u.displayName + (u.status !== 'active' ? '(' + u.status + ')' : '')).join(', ')),
  deptBAgents: deptB.map(x => { const u = us.find(v => v.userId === x); return u ? u.displayName + ' = ' + rn(u.orgUnitId) : x.slice(0, 8) + ' not in desk list'; }),
  noRole: us.filter(u => !orgs.some(o => id(o) === u.orgUnitId)).map(u => u.displayName + ' ' + u.orgUnitId.slice(0, 8)) };
