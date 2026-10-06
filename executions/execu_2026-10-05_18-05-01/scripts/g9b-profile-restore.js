// Revert the approved change: mahmoud.mahamed1515 back to CRM Admin + Desk Administrator (add first, remove Desk Agent only if the add worked).
const U = '3445ec4a-020e-4f12-b156-dd2de7610164', ADMIN = '44444444-4444-4444-4444-444444444401', AGENT = '44444444-4444-4444-4444-444444444402', MGR = 'd46e0424-fd6f-914e-b4cf-f1597f7cbdcd';
const names = async () => arr((await api('GET', '/iam/users?page_size=200')).j.data).find(u => u.userId === U).profileNames;
const before = await names();
const add = await api('POST', `/iam/users/${U}/profiles`, { profile_id: ADMIN, scope_id: MGR });
const mid = await names(); let del = { s: 'skipped' };
if (/Desk Administrator/.test(mid)) del = await api('DELETE', `/iam/users/${U}/profiles/${AGENT}`);
const after = await names();
const desk = arr((await api('GET', '/iam/users?app_key=desk&page_size=200')).j.data).find(u => u.userId === U) || {};
rec('REVERT.profile', /Desk Administrator/.test(after) && /CRM Admin/.test(after) && !/Desk Agent/.test(after) ? 'PASS' : 'FAIL', `before "${before}"; add Desk Administrator (scope Manager/desk) → ${add.s} ${add.s >= 300 ? add.t.slice(0, 120) : ''}; remove Desk Agent → ${del.s}; after "${after}"; desk org unit ${desk.orgUnitId === MGR ? 'Manager' : desk.orgUnitId}`);
return done();
