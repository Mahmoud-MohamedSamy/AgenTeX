// Assign Desk Agent to the test user with the Desk "Manager" org scope (same scope the other Desk admins use).
const U = '3445ec4a-020e-4f12-b156-dd2de7610164', AGENT = '44444444-4444-4444-4444-444444444402', MGR = 'd46e0424-fd6f-914e-b4cf-f1597f7cbdcd';
const r = await api('POST', `/iam/users/${U}/profiles`, { profile_id: AGENT, scope_id: MGR });
const all = arr((await api('GET', '/iam/users?page_size=200')).j.data).find(u => u.userId === U).profileNames;
const desk = (arr((await api('GET', '/iam/users?app_key=desk&page_size=200')).j.data).find(u => u.userId === U) || {});
rec('SETUP.profile', /Desk Agent/.test(all) && /CRM Admin/.test(all) ? 'PASS' : 'FAIL', `POST Desk Agent (scope Manager/desk) → ${r.s} ${r.s >= 400 ? r.t.slice(0, 160) : ''}; profiles now "${all}"; desk org unit ${desk.orgUnitId === MGR ? 'Manager' : desk.orgUnitId}`);
return done();
