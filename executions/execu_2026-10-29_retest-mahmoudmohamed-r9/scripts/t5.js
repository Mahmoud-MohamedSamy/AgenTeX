const V = '51666421-12cb-426e-b91e-3003a2a1f923';
const profs = arr((await api('GET', '/iam/profiles')).j?.data).map(p => [p.id, p.name, p.rank, p.app_key || p.appKey].join(' | '));
const u = await api('GET', `/iam/users/${V}`); const up = await api('GET', `/iam/users/${V}/profiles`);
return done({ profs, user: u.s + ' ' + JSON.stringify(u.j?.data).slice(0, 400), userProfiles: up.s + ' ' + up.t.slice(0, 500) });
