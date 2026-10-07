// Approved: mahmoud.mohamed1 Desk Administrator -> Desk Agent for this run (scope Desk "Manager"). Add first, remove only if the add worked.
const U = '18ba78c4-20c2-49e3-b159-55e1af2043ae', ADMIN = '44444444-4444-4444-4444-444444444401', AGENT = '44444444-4444-4444-4444-444444444402', MGR = 'd46e0424-fd6f-914e-b4cf-f1597f7cbdcd';
const names = async () => arr((await api('GET', '/iam/users?page_size=200')).j.data).find(u => u.userId === U).profileNames;
const deskOU = async () => (arr((await api('GET', '/iam/users?app_key=desk&page_size=200')).j.data).find(u => u.userId === U) || {}).orgUnitId;
const before = await names(), ou0 = await deskOU();
const add = await api('POST', `/iam/users/${U}/profiles`, { profile_id: AGENT, scope_id: MGR });
const mid = await names(); let del = { s: 'skipped', t: '' };
if (/Desk Agent/.test(mid)) del = await api('DELETE', `/iam/users/${U}/profiles/${ADMIN}?scopeId=${MGR}`);
const after = await names();
rec('SETUP.agent', after === 'Desk Agent' ? 'PASS' : 'FAIL', `before "${before}" (desk org unit ${ou0 === MGR ? 'Manager' : ou0}); add Desk Agent → ${add.s} ${add.s >= 300 ? add.t.slice(0, 120) : ''}; remove Desk Administrator (scopeId Manager) → ${del.s} ${del.s >= 300 ? del.t.slice(0, 120) : ''}; after "${after}"`);
return done();
