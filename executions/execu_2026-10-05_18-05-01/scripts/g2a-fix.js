// Fix: give mahmoud.mahamed1515 the Desk Agent profile (Desk Administrator was removed, add failed with 400).
const U = '3445ec4a-020e-4f12-b156-dd2de7610164', AGENT = '44444444-4444-4444-4444-444444444402';
const users = async () => arr((await api('GET', '/iam/users?page_size=200')).j.data).find(u => u.userId === U).profileNames;
const tries = [];
let r = await api('POST', `/iam/users/${U}/profiles`, { profile_id: AGENT }); tries.push(`plain → ${r.s} ${r.t.slice(0, 200)}`);
if (r.s >= 400) { r = await api('POST', `/iam/users/${U}/profiles`, { profile_id: AGENT, scope_id: null }); tries.push(`scope_id null → ${r.s} ${r.t.slice(0, 160)}`); }
const now = await users();
rec('SETUP.profile.fix', /Desk Agent/.test(now) ? 'PASS' : 'FAIL', tries.join(' || ') + ` ; now "${now}"`);
return done();
