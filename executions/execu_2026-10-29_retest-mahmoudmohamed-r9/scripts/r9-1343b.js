// NDC-1343 follow-up: (a) find + delete the QA profile from r9-1343 and check its audit events; (b) org unit under team1, delete, audit;
// (c) the login / logout events without a user — which action, which channel.
const out = {}; const t = String(Date.now()).slice(-5);
const ev = async app => arr((await api('o', 'GET', `/audit/events?app_key=${app}&limit=200`)).j?.data);
const prof = arr((await api('o', 'GET', '/iam/profiles')).j?.data).filter(p => /^QA RT 1343 profile/.test(p.name));
out.qaProfiles = prof.map(p => [p.name, p.profileId]);
for (const p of prof) { out['delete ' + p.name] = (await api('o', 'DELETE', '/iam/profiles/' + p.profileId)).s; ledger(`profile ${p.profileId} "${p.name}" (NDC-1343) deleted: ${out['delete ' + p.name]}`); }
const ou = await api('o', 'POST', '/iam/org-units', { name: 'QA RT 1343 OU ' + t, parentId: T.OU_TEAM1 }); const ouId = ou.j?.data?.orgUnitId || ou.j?.data?.id; out.ouCreate = ou.s + ' ' + (ouId || ou.t.slice(0, 160));
if (ouId) { out.ouDelete = (await api('o', 'DELETE', '/iam/org-units/' + ouId)).s; ledger(`org unit ${ouId} "QA RT 1343 OU ${t}" (NDC-1343) deleted: ${out.ouDelete}`); }
await sleep(45000);
const iam = await ev('iam');
for (const p of prof) out['audit ' + p.name] = iam.filter(e => e.target_id === p.profileId).map(e => e.action + ' by ' + (e.actor_label || e.actor_id));
if (ouId) out.auditOU = iam.filter(e => e.target_id === ouId).map(e => e.action + ' by ' + (e.actor_label || e.actor_id));
const sess = iam.filter(e => /login|logout/.test(e.action));
const noUser = sess.filter(e => !e.actor_id && !e.actor_label);
out.sessions = { total: sess.length, withActor: sess.length - noUser.length, noUser: noUser.map(e => ({ action: e.action, at: e.occurred_at, actor_type: e.actor_type, channel: e.source_channel, target: e.target_type + ':' + (e.target_label || '').replace(/[\w.+-]+@[\w.-]+/g, '<email>') })).slice(0, 10) };
out.labelSample = sess.slice(0, 3).map(e => ({ action: e.action, actor_label: (e.actor_label || '').replace(/[\w.+-]+@[\w.-]+/g, '<email>'), actor_type: e.actor_type }));
return out;
