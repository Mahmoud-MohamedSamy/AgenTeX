// Desk retest: field permissions (2228), set-default with records (2240), module permissions (2220), desk directory.
const MID = 'c0394292-52a2-446d-a326-06733fe289ba', LID = '83c29e1a-37f1-4a43-b6b2-33a47cb4b666';
const AGENT = '44444444-4444-4444-4444-444444444402', ADMIN = '44444444-4444-4444-4444-444444444401';
const T = {}; const e = r => r.s + ' ' + (r.s >= 300 ? ((r.j?.error?.code || '') + ' ' + (r.j?.error?.details?.[0]?.message || r.j?.error?.message || '')).slice(0, 160) : '');
const F = await fieldsOf(MID); const nameF = F.find(f => f.fieldName === 'name'); const slF = F.find(f => f.fieldName === 'qa_sl10');
T['2228 required name → hidden for Desk Agent'] = e(await api('POST', `/modules/${MID}/field-permissions`, { fieldId: nameF.id, profileId: AGENT, permission: 'hidden' }));
T['2228 required name → read-only for Desk Agent'] = e(await api('POST', `/modules/${MID}/field-permissions`, { fieldId: nameF.id, profileId: AGENT, permission: 'read_only' }));
T['2228 optional field → hidden (control)'] = e(await api('POST', `/modules/${MID}/field-permissions`, { fieldId: slF.id, profileId: AGENT, permission: 'hidden' }));
const fp = await api('GET', `/modules/${MID}/field-permissions`); T['2228 stored permissions'] = fp.s + ' ' + fp.t.slice(0, 300);
// 2240: second layout with 6 records, set default, then back
const lays0 = arr((await api('GET', `/modules/${MID}/layouts`)).j.data);
let L2 = lays0.find(l => l.name === 'QA RT L2');
if (!L2) { const base = await getLayout(MID, LID); const b = { ...base, name: 'QA RT L2' }; delete b.id; delete b.isDefault; const c = await api('POST', `/modules/${MID}/layouts`, b); T['2240 create layout'] = e(c); L2 = c.j?.data; }
if (L2) { for (let i = 0; i < 6; i++) await api('POST', `/modules/${MID}/records`, { data: [{ field: 'name', value: enc('QA RT L2 rec ' + i) }], layout_id: L2.id });
  T['2240 set-default (layout with 6 records)'] = e(await api('POST', `/modules/${MID}/layouts/${L2.id}/set-default`));
  T['2240 default now'] = arr((await api('GET', `/modules/${MID}/layouts`)).j.data).filter(l => l.isDefault).map(l => l.name).join(',');
  T['2240 back to Default'] = e(await api('POST', `/modules/${MID}/layouts/${LID}/set-default`));
  T['2240 default after'] = arr((await api('GET', `/modules/${MID}/layouts`)).j.data).filter(l => l.isDefault).map(l => l.name).join(','); }
// 2220: module permission PUT on a second QA module
const m2 = await mkModule('qa_rt_closed', 'QA RT Closed');
T['2220 PUT permissions [Desk Administrator]'] = e(await api('PUT', `/modules/${m2.id}/permissions`, { profileIds: [ADMIN] }));
T['2220 GET permissions'] = (await api('GET', `/modules/${m2.id}/permissions`)).t.slice(0, 250);
T['2220 ACL'] = (await api('GET', `/modules/${m2.id}/acl`)).t.slice(0, 300);
const dir = await api('GET', '/iam/users/directory?app_key=desk'); T['desk directory'] = dir.s + ' ' + JSON.stringify(arr(dir.j?.data).map(u => (u.email || u.display_name) + ':' + (u.profileNames || u.profiles || '')));
return done({ T, m2: m2.id, L2: L2 && L2.id });
