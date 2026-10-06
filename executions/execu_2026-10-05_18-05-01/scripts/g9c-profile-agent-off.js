// Finish the revert: remove the Desk Agent profile that was added with scope Manager/desk.
const U = '3445ec4a-020e-4f12-b156-dd2de7610164', AGENT = '44444444-4444-4444-4444-444444444402', MGR = 'd46e0424-fd6f-914e-b4cf-f1597f7cbdcd';
const names = async () => arr((await api('GET', '/iam/users?page_size=200')).j.data).find(u => u.userId === U).profileNames;
const del = await api('DELETE', `/iam/users/${U}/profiles/${AGENT}?scopeId=${MGR}`);
const after = await names();
rec('REVERT.profile', /Desk Administrator/.test(after) && /CRM Admin/.test(after) && !/Desk Agent/.test(after) ? 'PASS' : 'FAIL', `DELETE Desk Agent ?scopeId=Manager → ${del.s} ${del.s >= 300 ? del.t.slice(0, 120) : ''}; profiles now "${after}"`);
return done();
