const C = []; const S = x => ({ s: x.s, e: x.j && x.j.error ? (x.j.error.code + ': ' + String(x.j.error.message).slice(0, 140)) : undefined });
const D = '/desk/departments'; const o = {}; const OWNER = '7017d261-36ee-4e2f-9e60-2310ece52ef8'; const DEF = '369b76d3-eef4-4698-97db-be0c47e61ec5';
let r = await api('POST', D, { name: 'QA GL Dept', visibility: 'private', agent_user_ids: [OWNER], description: 'QA go-live wave 1' });
const id = r.j && r.j.data && r.j.data.id; if (id) C.push({ k: 'dept', id });
o.W1_21 = { ...S(r), id, channels: r.j && r.j.data && (r.j.data.channels || []).map(c => c.channel_type).join(','), active: r.j && r.j.data && r.j.data.is_active };
const g0 = await api('GET', D + '/' + id); const before = g0.j && g0.j.data;
r = await api('PATCH', D + '/' + id, { cc_enabled: false, send_as_email_enabled: false, scheduled_replies_enabled: true, help_center_display_name: 'QA GL Help name' });
const g1 = await api('GET', D + '/' + id); const a = g1.j && g1.j.data || {};
o.W1_22 = { ...S(r), cc: a.cc_enabled, sendAs: a.send_as_email_enabled, sched: a.scheduled_replies_enabled, hc: a.help_center_display_name, keys: Object.keys(a).filter(k => /sched|mass|private/.test(k)).join(',') };
const v1 = await api('POST', D, { name: 'techSupport', visibility: 'private' });
const v2 = await api('POST', D, { name: '', visibility: 'private' });
const v3 = await api('POST', D, { name: 'QA GL ' + 'x'.repeat(300), visibility: 'private' });
const v4 = await api('PATCH', D + '/' + id, { name: 'Tech' });
for (const v of [v1, v2, v3]) if (v.j && v.j.data && v.j.data.id) C.push({ k: 'dept', id: v.j.data.id });
o.W1_23 = { dupCreate: S(v1), empty: S(v2), long: S(v3), dupRename: S(v4) };
if (v4.s < 300) { await api('PATCH', D + '/' + id, { name: 'QA GL Dept' }); o.W1_23.renamedBack = true; }
o.W1_24 = S(await api('POST', D + '/' + DEF + '/disable', {}));
const tt = await api('GET', D + '/' + id + '/transfer-targets'); o.W1_25 = { targets: (tt.j && tt.j.data || []).length };
r = await api('POST', D + '/' + id + '/disable', { transfer_to_department_id: DEF }); const g2 = await api('GET', D + '/' + id);
const en = await api('POST', D + '/' + id + '/enable', {}); const g3 = await api('GET', D + '/' + id);
o.W1_25 = { ...o.W1_25, disable: S(r), afterDisable: g2.j && g2.j.data && g2.j.data.is_active, enable: S(en), afterEnable: g3.j && g3.j.data && g3.j.data.is_active };
// concurrency: two patches, second with stale version marker if any
const ver = before && (before.row_version ?? before.version ?? before.updated_at);
const c1 = await api('PATCH', D + '/' + id, { description: 'QA GL tab A' }, { 'If-Match': String(ver) });
const c2 = await api('PATCH', D + '/' + id, { description: 'QA GL tab B' }, { 'If-Match': String(ver) });
const g4 = await api('GET', D + '/' + id);
o.W1_27 = { versionField: before && ('row_version' in before ? 'row_version' : 'version' in before ? 'version' : 'none'), first: S(c1), staleSecond: S(c2), final: g4.j && g4.j.data && g4.j.data.description };
// audit check later uses this id
o.id = id;
return done({ o, C });
