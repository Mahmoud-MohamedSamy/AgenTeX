const o = {}; const S = r => ({ s: r.s, e: r.j && r.j.error ? (r.j.error.code + ': ' + r.j.error.message).slice(0, 200) : null });
const DA = '44444444-4444-4444-4444-444444444402'; const NEW = 'mahmoud.mmohamedsamy+qagln@gmail.com';
const users = async () => (await api('GET', '/iam/users?limit=200')).j.data;
const inv = await api('POST', '/iam/users/invite', { email: NEW, profile_id: DA, display_name: 'QA GL N Invite' }); o.W1_29 = { ...S(inv), d: JSON.stringify(inv.j && inv.j.data).slice(0, 250) };
let u = (await users()).find(x => x.email === NEW); o.listed = u ? { status: u.status, inv: u.invitationStatus, exp: u.invitationExpiresAt, profiles: u.profileNames } : null;
o.W1_30_new = S(await api('POST', '/iam/users/invite', { email: NEW, profile_id: DA }));
o.W1_30_active = S(await api('POST', '/iam/users/invite', { email: 'mmohamed@anyware.software', profile_id: DA }));
o.dupCount = (await users()).filter(x => x.email === NEW).length;
if (u && u.invitationId) { o.W1_32_resend = S(await api('POST', '/iam/users/invitations/' + u.invitationId + '/resend', {})); const u2 = (await users()).find(x => x.email === NEW); o.expAfterResend = u2 && u2.invitationExpiresAt;
  o.W1_32_cancel = S(await api('POST', '/iam/users/invitations/' + u.invitationId + '/cancel', {})); const u3 = (await users()).find(x => x.email === NEW); o.afterCancel = u3 ? { status: u3.status, inv: u3.invitationStatus } : 'gone'; }
// agent details
const all = await users(); const f = all.find(x => x.email === 'fedelav803@meinvr.com'); o.fedelav = { profiles: f.profileNames, orgUnit: f.orgUnitId };
const ad = await api('POST', '/desk/agents/departments/query', { user_ids: [f.userId] }); o.fedDepts = JSON.stringify(ad.j && ad.j.data).slice(0, 300);
for (const e of ['kinase5517@meinvr.com', 'pobit51574@meinvr.com', 'belopoy720@meinvr.com', 'pacox68754@meinvr.com', 'mahmoud.mohamed1@taviportal.com', 'mahmoud.mohamed2@taviportal.com', 'mahmoud.mahamed1515@gmail.com', 'mahmoud.mmohamedsamy@gmail.com']) { const x = all.find(y => y.email === e); o[e] = x && (x.profileNames || []).join('/') + ' | ' + x.userId; }
const ad2 = await api('POST', '/desk/agents/departments/query', { user_ids: all.filter(x => /meinvr|taviportal.com|mahamed1515|mmohamedsamy/.test(x.email)).map(x => x.userId) }); o.depts = JSON.stringify(ad2.j && ad2.j.data).slice(0, 1500);
return done(o);
