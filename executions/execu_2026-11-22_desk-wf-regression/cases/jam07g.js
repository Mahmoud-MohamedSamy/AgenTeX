const orgs = arr((await api('GET', '/iam/org-units?take=500')).j?.data).filter(o => o.app_key === 'desk' || /^desk/.test(o.path || ''));
const us = arr((await api('GET', '/iam/users?take=200')).j?.data); const id = o => o.orgUnitId || o.id;
return orgs.map(o => ({ id: id(o).slice(0, 8), name: o.name, path: o.path, depth: o.depth, members: us.filter(u => u.orgUnitId === id(o)).length })).sort((a, b) => (a.path || '').localeCompare(b.path || '')).slice(0, 40);
