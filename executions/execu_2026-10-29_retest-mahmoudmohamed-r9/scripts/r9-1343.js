// NDC-1343: one QA action per entity type, then the audit feed (apps crm, metadata-engine, iam, workflow) must hold each event with the actor.
// Every QA item is removed again in this script. Login / logout events: does each name the user? Entity filter (facets): which entities exist.
const out = {}; const APPS = ['crm', 'metadata-engine', 'iam', 'workflow']; const t = String(Date.now()).slice(-5); const QAMOD = 'e2e1c128-c1f2-4392-835d-528cff1df759';
const events = async () => { const all = []; for (const a of APPS) all.push(...arr((await api('o', 'GET', `/audit/events?app_key=${a}&limit=200`)).j?.data).map(e => ({ ...e, _app: a }))); return all; };
const find = (all, id, act) => all.filter(e => (e.target_id === id || JSON.stringify(e).includes(id)) && (!act || String(e.action).toLowerCase().includes(act)));
const actors = all => [...new Set(all.map(e => e.actor_display_name || e.actor_name || e.actor_email || e.actor_id || e.user_id || '(none)'))].map(String).map(x => x.replace(/[\w.+-]+@[\w.-]+/g, '<email>'));
const T0 = new Date().toISOString(); const ids = {}; const res = {};
// 1 record
const l = (await X.lead('o', 'QA RT 1343 audit lead ' + t)).j?.data?.id; ids.lead = l;
await api('o', 'PATCH', `/modules/${T.LEADS}/records/${l}`, { data: [{ field: 'description', value: { kind: 'string', value: 'QA RT 1343 edit' } }] });
await api('o', 'DELETE', `/modules/${T.LEADS}/records/${l}`);
// 2 field on the QA module
const f = await api('o', 'POST', `/modules/${QAMOD}/fields`, { fields: [{ fieldName: 'qa_audit_' + t, labels: { en: 'QA RT 1343 field' }, datatypeKey: 'single_line', required: false, unique: false }] });
const fid = arr((await api('o', 'GET', `/modules/${QAMOD}/fields`)).j?.data).find(x => x.apiName === 'qa_audit_' + t)?.id; ids.field = fid; out.fieldCreate = f.s;
if (fid) out.fieldDelete = (await api('o', 'DELETE', `/modules/${QAMOD}/fields/${fid}`)).s;
// 3 workflow rule
const w = await api('o', 'POST', '/workflow/rules', X.wf(T.LEADS, 'QA RT 1343 audit rule ' + t, 'QA RT 1343 NOMATCH', { actions: [X.fieldUpdate('description', 'x')] })); ids.rule = w.j?.data?.id;
if (ids.rule) out.ruleDelete = (await api('o', 'DELETE', '/workflow/rules/' + ids.rule)).s;
// 4 profile
const p = await api('o', 'POST', '/iam/profiles', { name: 'QA RT 1343 profile ' + t, appKey: 'crm', app_key: 'crm', parentProfileId: T.P_USER, rank: 50, permissions: [] }); ids.profile = p.j?.data?.profileId || p.j?.data?.id; out.profileCreate = p.s + (p.s > 299 ? ' ' + p.t.slice(0, 160) : '');
if (ids.profile) out.profileDelete = (await api('o', 'DELETE', '/iam/profiles/' + ids.profile)).s;
// 5 user override on U1
out.override = (await api('o', 'POST', `/iam/users/${T.U1}/overrides`, { permission_key: 'iam.security.loginhistory.view_team', effect: 'DENY', reason: 'QA RT 1343 audit' })).s;
out.overrideClear = (await api('o', 'DELETE', `/iam/users/${T.U1}/overrides/iam.security.loginhistory.view_team?reason=QA%20RT%201343`)).s;
// 6 org unit
const ou = await api('o', 'POST', '/iam/org-units', { name: 'QA RT 1343 OU ' + t, parentId: T.OU_ORG }); ids.ou = ou.j?.data?.orgUnitId || ou.j?.data?.id; out.ouCreate = ou.s + (ou.s > 299 ? ' ' + ou.t.slice(0, 160) : '');
if (ids.ou) out.ouDelete = (await api('o', 'DELETE', '/iam/org-units/' + ids.ou)).s;
ledger(`NDC-1343 audit probes (all removed in the same script): ${JSON.stringify(ids)}`);
await sleep(60000);
let all = await events(); for (let i = 0; i < 3 && !find(all, ids.lead).length; i++) { await sleep(30000); all = await events(); }
const check = (k, id, acts) => { if (!id) { res[k] = 'not created'; return; } const hits = find(all, id); res[k] = { events: hits.map(e => e._app + ':' + e.action).slice(0, 6), actors: actors(hits), missing: acts.filter(a => !hits.some(e => String(e.action).toLowerCase().includes(a))) }; };
check('record', ids.lead, ['created', 'updated', 'deleted']); check('field', ids.field, ['created', 'deleted']); check('workflow rule', ids.rule, ['created', 'deleted']);
check('profile', ids.profile, ['created', 'deleted']); check('org unit', ids.ou, ['created', 'deleted']);
const ov = all.filter(e => e.target_id === T.U1 && /override|permission/i.test(JSON.stringify(e)) && e.occurred_at >= T0 || (e.created_at >= T0 && JSON.stringify(e).includes('loginhistory.view_team')));
res['user override'] = { events: ov.map(e => e._app + ':' + e.action).slice(0, 4), actors: actors(ov) };
const sess = arr((await api('o', 'GET', '/audit/events?app_key=iam&limit=200')).j?.data).filter(e => /log(ged)?[ _-]?(in|out)|session|sign/i.test(String(e.action) + e.target_type));
res.sessions = { n: sess.length, withoutUser: sess.filter(e => !(e.actor_display_name || e.actor_name || e.actor_email || e.actor_id || e.user_id)).length, actions: [...new Set(sess.map(e => e.action))].slice(0, 6) };
const fc = await api('o', 'GET', '/audit/events/facets?app_key=crm&app_key=iam&app_key=metadata-engine&app_key=workflow'); out.facets = fc.s + ' ' + fc.t.slice(0, 500);
out.sampleKeys = Object.keys(all[0] || {}); out.results = res;
return out;
