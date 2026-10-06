// Approved change: mahmoud.mahamed1515 Desk Administrator -> Desk Agent (CRM Admin untouched). Reverted in cleanup.
const U = '3445ec4a-020e-4f12-b156-dd2de7610164', ADMIN = '44444444-4444-4444-4444-444444444401', AGENT = '44444444-4444-4444-4444-444444444402';
const users = async () => arr((await api('GET', '/iam/users?page_size=200')).j.data).find(u => u.userId === U).profileNames;
const before = await users();
const add = await api('POST', `/iam/users/${U}/profiles`, { profile_id: AGENT });
const mid = await users();
const del = await api('DELETE', `/iam/users/${U}/profiles/${ADMIN}`);
const after = await users();
rec('SETUP.profile', /Desk Agent/.test(after) && !/Desk Administrator/.test(after) && /CRM Admin/.test(after) ? 'PASS' : 'FAIL', `before "${before}"; POST Desk Agent → ${add.s}; after add "${mid}"; DELETE Desk Administrator → ${del.s} ${del.s >= 400 ? del.t.slice(0, 150) : ''}; after "${after}"`);
return done();
