const out = {};
const users = arr((await api('GET', '/iam/users?take=200')).j?.data);
out.users = users.filter(u => /Customer Experience|Test User 1|Dev Team 2|QA Team 1|Mahmoud/i.test(u.displayName || '')).map(u => ({ name: u.displayName, status: u.status, profiles: u.profileNames, org: u.orgUnitId }));
const plist = arr((await api('GET', '/iam/profiles')).j?.data); out.pkeys = Object.keys(plist[0] || {});
for (const n of ['Desk Agent', 'Desk Light Agent', 'Desk Reviewer', 'Desk Supervisor']) { const p = plist.find(x => x.name === n); if (!p) continue; const id = p.id || p.profileId || p.profile_id; const pm = await api('GET', `/iam/profiles/${id}/permissions`); const s = pm.t; out[n] = { id, s: pm.s, wf: [...new Set((s.match(/workflow[:._][a-z_:.]+/g) || []))].slice(0, 30), sample: s.slice(0, 200) }; }
return out;
