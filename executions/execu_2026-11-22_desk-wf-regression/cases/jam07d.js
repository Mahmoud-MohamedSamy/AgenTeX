const ROLE = '685c01ab-5e57-4a96-af90-3c98dfe52692';
const orgs = arr((await api('GET', '/iam/org-units?take=500')).j?.data); const id = o => o.orgUnitId || o.id;
const me = orgs.find(o => id(o) === ROLE); const desc = orgs.filter(o => (o.path || '').startsWith((me.path || '') + '.') );
const us = arr((await api('GET', '/iam/users?take=200')).j?.data);
const cnt = oid => us.filter(u => u.orgUnitId === oid).length;
return { role: { name: me.name, path: me.path, members: cnt(ROLE) }, subRoles: desc.map(o => ({ name: o.name, path: o.path, members: cnt(id(o)) })), parent: (() => { const p = orgs.find(o => id(o) === me.parentId); return p && { name: p.name, members: cnt(id(p)) }; })() };
