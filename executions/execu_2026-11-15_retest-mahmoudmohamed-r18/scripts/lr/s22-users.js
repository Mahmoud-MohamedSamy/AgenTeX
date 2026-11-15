const out = {}; const r = await api('GET', '/iam/users?limit=200&pageSize=200'); const us = arr(r.j && r.j.data); out.n = us.length; out.keys = us[0] ? Object.keys(us[0]).join(',') : r.t.slice(0, 200);
out.match = us.filter(u => /test user|mahmoud samy/i.test(u.displayName || '')).map(u => ({ id: u.userId, name: u.displayName, profiles: u.profileNames, ou: u.orgUnitId }));
return out;
