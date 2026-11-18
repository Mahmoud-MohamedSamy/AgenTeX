// Read-only: permission keys, profile grants for desk ticket access, users, org units, dept agents
const A = x => Array.isArray(x) ? x : (x && (x.items || x.data || x.results || x.permissions)) || [];
const perms = D((await api('GET', '/iam/permissions?app_key=desk')).j); out.permCount = A(perms).length;
out.tkt = A(perms).map(p => p.key || p.code || p.name).filter(k => /ticket|share|move|depart|unassign|team|access|owner|follow|spam|merge|export/i.test(k || ''));
const profs = A(D((await api('GET', '/iam/profiles?app_key=desk')).j));
out.prof = {};
for (const p of profs) { const e = D((await api('GET', '/iam/profiles/' + p.id + '/effective')).j); const keys = (A(e).length ? A(e) : (e && (e.granted || e.effective || e.keys)) || []).map(x => typeof x === 'string' ? x : (x.key || x.code)); out.prof[p.name] = { id: p.id, n: keys.length, t: keys.filter(k => out.tkt.includes(k)), raw: A(e).length ? '' : JSON.stringify(e).slice(0, 300) }; }
const us = A(D((await api('GET', '/iam/users?app_key=desk&page_size=500&page=1')).j)); out.users = us.map(u => ({ n: u.displayName, m: (u.email || '').replace(/^(.{3}).*@/, '$1…@'), id: u.userId, ou: u.orgUnitId, p: u.profileNames, st: u.status, rm: u.reportingManagerId, own: u.isOwner }));
out.ou = D((await api('GET', '/iam/org-units?app_key=desk')).j);
const da = await api('POST', '/desk/agents/departments/query', { user_ids: us.map(u => u.userId) }); out.da = { s: da.s, j: JSON.stringify(D(da.j)).slice(0, 6000) };
return fin({ out });
