const ROLE = '685c01ab-5e57-4a96-af90-3c98dfe52692';
const us = arr((await api('GET', '/iam/users?take=200')).j?.data);
const hit = us.filter(u => JSON.stringify(u).includes(ROLE));
const orgs = arr((await api('GET', '/iam/org-units')).j?.data); const o = orgs.find(x => x.id === ROLE);
return { users: us.length, mentioningRole: hit.length, role: o ? { name: o.name, keys: Object.keys(o).join(','), parent: o.parentId || o.parent_id || null } : 'not found', sampleKeys: Object.keys(us[0] || {}).join(','), ac07RoleMembers: us.filter(u => u.orgUnitId === '7972984b-b5cc-034a-bd96-6de61e3937d0').length };
