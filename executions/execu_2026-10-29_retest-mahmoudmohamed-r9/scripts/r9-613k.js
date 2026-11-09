const r = await api('o', 'GET', '/iam/permissions?limit=1000'); const all = arr(r.j?.data);
const keys = all.map(x => x.key || x.permission_key || x.permissionKey || x.code).filter(Boolean);
return { n: all.length, sample: JSON.stringify(all[0]).slice(0, 300), login: keys.filter(k => /login|session|export/i.test(k)).slice(0, 40) };
