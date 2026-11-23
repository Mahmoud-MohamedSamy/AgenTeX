const out = {};
for (const p of ['/desk/agents?take=200', '/desk/agents', '/iam/users?take=200&app_key=desk']) { const r = await api('GET', p); const a = arr(r.j?.data?.items || r.j?.data?.agents || r.j?.data); out[p] = { s: r.s, n: a.length, keys: a[0] ? Object.keys(a[0]).join(',') : (r.t || '').slice(0, 150) }; }
const us = arr((await api('GET', '/iam/users?take=200&app_key=desk')).j?.data);
const pick = us.filter(u => /Customer Experience|Fathy|ZZ|sweap|Test User 1|Dev Team 2/i.test(u.displayName || u.email || ''));
out.deskUsers = pick.map(u => ({ name: u.displayName, orgUnitId: (u.orgUnitId || '').slice(0, 8), profiles: u.profileNames }));
return out;
