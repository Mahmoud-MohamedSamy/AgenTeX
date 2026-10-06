// Approved lowering (revert in cleanup): remove CRM Admin from the test user so only Desk Agent remains.
const U = '3445ec4a-020e-4f12-b156-dd2de7610164';
const crm = arr((await api('GET', '/iam/profiles')).j.data).find(x => x.name === 'CRM Admin');
const crmUsers = arr((await api('GET', '/iam/users?app_key=crm&page_size=200')).j.data).find(u => u.userId === U) || {};
const del = await api('DELETE', `/iam/users/${U}/profiles/${crm.profileId}`);
const now = arr((await api('GET', '/iam/users?page_size=200')).j.data).find(u => u.userId === U).profileNames;
rec('SETUP.crm-off', now === 'Desk Agent' ? 'PASS' : 'FAIL', `CRM Admin profile ${crm.profileId}; user's crm org unit before: ${crmUsers.orgUnitId}; DELETE → ${del.s}; profiles now "${now}"`, { crmProfileId: crm.profileId, crmOrgUnit: crmUsers.orgUnitId });
return done();
