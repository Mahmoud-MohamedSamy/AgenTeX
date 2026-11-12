// set the Desk profile of test user Mahmoud Samy (env PROF = agent | admin), replace the current Desk profile
const UID = 'd23fb4e0-248d-41f6-af60-d28885a7007e'; const P_ = { agent: '44444444-4444-4444-4444-444444444402', admin: '44444444-4444-4444-4444-444444444401' }[process.env.PROF];
const u0 = arr((await api('GET', '/iam/users?limit=200')).j.data).find(x => x.userId === UID); const r = await api('POST', '/iam/users/' + UID + '/profiles', { profile_id: P_, replace: true, scope_id: u0.orgUnitId }); LED('Mahmoud Samy desk profile -> ' + process.env.PROF + ' ' + r.s);
const u = arr((await api('GET', '/iam/users?limit=200')).j.data).find(x => x.userId === UID);
return { set: SR(r).slice(0, 200), now: u && u.profileNames };
