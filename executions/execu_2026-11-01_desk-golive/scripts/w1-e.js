const C = []; const S = x => ({ s: x.s, e: x.j && x.j.error ? (x.j.error.code + ': ' + String(x.j.error.message).slice(0, 160)) : undefined });
const o = {}; const pid = 'c83dddbf-983a-4c09-b004-bbfbbfe0fe6b'; const QAD = '9a7e391c-be72-49e4-a1cf-763e5c88e23d'; const DESK_AGENT = '44444444-4444-4444-4444-444444444402';
const add = await api('POST', '/iam/profiles/' + pid + '/permissions', { permission_key: 'desk:macros:manage', effect: 'allow' });
const eff1 = JSON.stringify((await api('GET', '/iam/profiles/' + pid + '/effective')).j.data);
const rm = await api('DELETE', '/iam/profiles/' + pid + '/permissions/' + encodeURIComponent('desk:macros:manage'));
const eff2 = JSON.stringify((await api('GET', '/iam/profiles/' + pid + '/effective')).j.data);
o.W1_40 = { add: S(add), hasAfterAdd: eff1.includes('desk:macros:manage'), remove: S(rm), hasAfterRemove: eff2.includes('desk:macros:manage') };
// invite exactly one agent
const inv = await api('POST', '/iam/users/invite', { email: 'mmohamed@anyware.software', profile_id: DESK_AGENT, display_name: 'QA GL Agent' });
const us = (await api('GET', '/iam/users?limit=200')).j.data; const u = us.find(x => x.email === 'mmohamed@anyware.software');
if (u) C.push({ k: 'invite', id: u.invitationId, user: u.userId, keep: true });
o.W1_29 = { invite: S(inv), status: u && u.status, profile: u && u.profileNames, expires: u && u.invitationExpiresAt, invitationId: u && u.invitationId, userId: u && u.userId };
o.W1_30 = S(await api('POST', '/iam/users/invite', { email: 'mmohamed@anyware.software', profile_id: DESK_AGENT }));
const n1 = await api('POST', '/iam/users/invite', { email: 'not-an-email', profile_id: DESK_AGENT });
const n2 = await api('POST', '/iam/users/invite', { email: 'qa-gl-nobody@example.invalid', profile_id: '11111111-1111-1111-1111-111111111111' });
o.W1_31 = { badEmail: S(n1), badProfile: S(n2) };
const after = (await api('GET', '/iam/users?limit=200')).j.data; o.W1_30.copies = after.filter(x => x.email === 'mmohamed@anyware.software').length;
o.W1_31.strayCreated = after.filter(x => /not-an-email|qa-gl-nobody/.test(x.email)).map(x => x.email);
if (u && u.invitationId) { o.W1_32 = S(await api('POST', '/iam/users/invitations/' + u.invitationId + '/resend', {})); const u2 = (await api('GET', '/iam/users?limit=200')).j.data.find(x => x.email === 'mmohamed@anyware.software'); o.W1_32.expiryBefore = u.invitationExpiresAt; o.W1_32.expiryAfter = u2 && u2.invitationExpiresAt; }
// put invitee in QA WF Dept R
if (u && u.userId && !/^0{8}/.test(u.userId)) { o.W1_29.dept = S(await api('PUT', '/desk/agents/' + u.userId + '/departments', { department_ids: [QAD] })); } else o.W1_29.dept = 'user id not assigned until invite accepted';
return done({ o, C });
