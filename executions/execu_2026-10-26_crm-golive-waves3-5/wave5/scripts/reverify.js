const M = 'df656ed7-da62-4e06-b17b-bb3c83961fde', LM = '98c36ff8-3621-411b-b373-14455f4df087', M2 = 'bb375218-6a5d-48ec-a832-fb062fd0311b', LB = 'f0bf4593-f455-4cee-8230-2e7c1b3d09d9', out = {}, made = { records: [], rules: [], deps: [], ts: [] };
const s = v => ({ kind: 'string', value: v }), n = v => ({ kind: 'number', value: v });
// B1 validation rule never applied
const vr = await call('POST', `/modules/${M}/validation-rules`, { name: 'QA W5 VR reverify', condition: 'qa_w5_number > 10', errorMessage: { en: 'QA W5 reverify: number must be 10 or less' } }); made.rules.push(vr.j.data.id);
const list = (await call('GET', `/modules/${M}/validation-rules`)).j.data; out.B1_activeRules = list.filter(r => r.status === 'active').length;
const rec = await call('POST', `/modules/${M}/records`, { layout_id: LM, data: [{ field: 'name', value: s('QA W5 reverify 50') }, { field: 'qa_w5_pick_list', value: s('Red') }, { field: 'qa_w5_number', value: n(50) }] }); out.B1_save50 = rec.s; if (rec.s < 300) made.records.push(rec.j.data.id);
const upd = rec.s < 300 ? await call('PATCH', `/modules/${M}/records/${rec.j.data.id}`, { data: [{ field: 'qa_w5_number', value: n(999) }] }) : null; out.B1_update999 = upd && upd.s;
// B4 empty dependency map
const dm = await call('POST', `/modules/${M}/dependency-maps`, {}); out.B4_emptyDependency = dm.s + ' ' + (dm.s < 300 ? dm.j.data.controllingFieldId : ''); if (dm.s < 300) made.deps.push(dm.j.data.id);
// B5 layout assignment API
const cur = (await call('GET', `/modules/${M2}/layouts/${LB}`)).j.data;
const put = await call('PUT', `/modules/${M2}/layouts/${LB}`, { name: cur.name, views: cur.views, assignedProfiles: [], accessMode: 'all_users', status: cur.status, rowVersion: cur.rowVersion }); const back = (await call('GET', `/modules/${M2}/layouts/${LB}`)).j.data; out.B5_putAccessAllUsers = put.s + ' -> now ' + back.accessMode + ' rowVersion ' + cur.rowVersion + '->' + back.rowVersion;
out.B5_postAssignments = (await call('POST', `/modules/${M2}/layouts/assignments`, { assignments: [{ profileId: '11111111-1111-1111-1111-111111111103', layoutId: LB }] })).s;
out.B5_getAssignments = (await call('GET', `/modules/${M2}/layouts/assignments`)).s;
// B3 duplicate folder 500 (fresh teamspace)
const ts = await call('POST', '/teamspaces', { name: 'QA W5 Teamspace B', access_mode: 'selected' }); if (ts.s < 300) { made.ts.push(ts.j.data.id); out.B7_teamspaceAccessMode = ts.j.data.accessMode;
  const f1 = await call('POST', `/teamspaces/${ts.j.data.id}/folders`, { name: 'QA W5 Same' }); const f2 = await call('POST', `/teamspaces/${ts.j.data.id}/folders`, { name: 'QA W5 Same' }); out.B3_duplicateFolder = f1.s + ' then ' + f2.s + ' ' + f2.t.slice(0, 120); }
out.made = made; return out;
