const ROLE = '685c01ab-5e57-4a96-af90-3c98dfe52692'; const out = {};
let all = []; for (let skip = 0; skip < 2000; skip += 200) { const a = arr((await api('GET', `/iam/users?take=200&skip=${skip}`)).j?.data); all.push(...a); if (a.length < 200) break; }
out.usersTotal = all.length; out.uniq = new Set(all.map(u => u.userId)).size;
out.members = all.filter(u => u.orgUnitId === ROLE).map(u => ({ id: u.userId.slice(0, 8), status: u.status, profiles: u.profileNames, name: (u.displayName || '').slice(0, 25) }));
for (const p of ['/iam/org-units?take=500', '/iam/org-units/' + ROLE, '/iam/org-units/tree']) { const r = await api('GET', p); out[p] = r.s + ' ' + (JSON.stringify(r.j?.data) || '').match(/.{0,80}685c01ab.{0,120}/)?.[0]; }
return out;
