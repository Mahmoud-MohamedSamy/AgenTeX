await page.goto('https://staging-crm.taviportal.com/settings/general/users', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(3000);
const r = await call('POST', '/iam/users/invite', { email: 'hmohamed@anyware.software', profile_id: '11111111-1111-1111-1111-111111111103', lifetime_days: 1, display_name: 'QA W1 throwaway', org_unit_id: '60aeb9ce-e602-4e95-aaef-de3ceba25a3e' });
const body = r.t; const hasToken = /token|register|invitation\/|https?:\/\//i.test(body);
const keys = r.j && r.j.data ? Object.keys(r.j.data) : [];
const l = (await call('GET', '/iam/users?limit=200')).j.data; const u = (Array.isArray(l) ? l : l.items).find(x => x.email === 'hmohamed@anyware.software');
let cancel = null; if (u && u.invitationId) cancel = (await call('DELETE', `/iam/users/invitations/${u.invitationId}`)).s;
if (cancel && cancel >= 300) cancel = cancel + ' / ' + (await call('POST', `/iam/users/invitations/${u.invitationId}/cancel`)).s;
const l2 = (await call('GET', '/iam/users?limit=200')).j.data; const u2 = (Array.isArray(l2) ? l2 : l2.items).find(x => x.email === 'hmohamed@anyware.software');
return { invite: r.s, responseKeys: keys, linkOrTokenInResponse: hasToken, invitationStatus: u && u.invitationStatus, cancel, after: u2 ? (u2.status + '/' + u2.invitationStatus) : 'none' };
