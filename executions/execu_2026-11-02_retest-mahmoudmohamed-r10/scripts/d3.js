// Desk M&F batch 2 (Anyware): 2261 required+read-only via layout API, 2230 SHOW/REQUIRE dependency applied by the record API, 2231 visibilityRule, 2260 rollup over a foreign relation, 2387 read-only on a required field, 2232 department storage.
const out = {}; const M = '0a2f56b2-681d-41c1-b504-d2140eecb1e8', LY = '09b93625-6702-4995-a484-3319b63f3f9f', DM = 'ee386e8d-6d19-4cc0-94b0-100661f513dd';
const sv = v => ({ kind: 'string', value: v }); const short = r => r.s + ' ' + (r.s > 299 ? (r.j?.error?.code || '') + ' ' + (r.j?.error?.message || r.t).slice(0, 170) : '');
const fl = arr((await api('o', 'GET', `desk:/modules/${M}/fields`)).j?.data); const F = n => fl.find(x => x.apiName === n);
const getL = async () => (await api('o', 'GET', `desk:/modules/${M}/layouts/${LY}`)).j?.data;
const strip = o => { const c = JSON.parse(JSON.stringify(o)); for (const k of ['id', 'moduleId', 'createdAt', 'createdBy', 'createdByName', 'lastModifiedAt', 'lastModifiedBy', 'lastModifiedByName']) delete c[k]; return c; };
const entry = (n, cfg = {}) => { const f = F(n); return { id: f.id, fieldName: n, apiName: n, labels: f.labels, datatypeKey: f.datatypeKey, fieldOrder: 9, config: { required: false, unique: false, ...cfg }, isSystemField: false, isSystemManaged: false, isDeletable: true }; };
// place qa_kind, qa_serial, qa_ctrl, qa_dep on CREATE (+ DETAIL) column 0
let L = await getL(); const place = (lay, extra) => { for (const v of ['CREATE', 'DETAIL']) { const col = lay.views[v]?.layout?.sections?.[0]?.columns?.[0]; if (!col) continue; col.fields = col.fields.filter(x => !['qa_kind', 'qa_serial', 'qa_ctrl', 'qa_dep'].includes(x.fieldName)).concat(extra()); } return lay; };
L = place(L, () => [entry('qa_kind'), entry('qa_serial'), entry('qa_ctrl'), entry('qa_dep')]);
out.place = short(await api('o', 'PUT', `desk:/modules/${M}/layouts/${LY}`, strip(L)));
// 2261: required + read_only on one field
L = await getL(); const L2261 = place(JSON.parse(JSON.stringify(L)), () => [entry('qa_kind'), entry('qa_serial', { required: true, read_only: true }), entry('qa_ctrl'), entry('qa_dep')]);
out['2261_req_ro'] = short(await api('o', 'PUT', `desk:/modules/${M}/layouts/${LY}`, strip(L2261)));
// 2230: dependencies SHOW + REQUIRE serial when kind = Hardware
L = await getL(); const kind = F('qa_kind').id, serial = F('qa_serial').id;
L.dependencies = [{ id: crypto.randomUUID(), parentFieldId: kind, parentValues: ['Hardware'], action: 'SHOW', childFieldIds: [serial] }, { id: crypto.randomUUID(), parentFieldId: kind, parentValues: ['Hardware'], action: 'REQUIRE', childFieldIds: [serial] }];
// 2231: visibilityRule: qa_dep required, shown only when qa_ctrl = x
const L2 = place(L, () => [entry('qa_kind'), entry('qa_serial'), entry('qa_ctrl'), { ...entry('qa_dep', { required: true }), config: { required: true, unique: false, visibilityRule: { dependsOn: 'qa_ctrl', anyNonEmpty: false, equalsAny: ['x'] } } }]);
out.depsSave = short(await api('o', 'PUT', `desk:/modules/${M}/layouts/${LY}`, strip(L2)));
out.depsStored = ((await getL()).dependencies || []).length;
const rec = async (n, more) => short(await api('o', 'POST', `desk:/modules/${M}/records`, { layout_id: LY, data: [{ field: 'name', value: sv(n) }, ...Object.entries(more).map(([k, v]) => ({ field: k, value: sv(v) }))] }));
out['2230_hw_no_serial'] = await rec('QA RT r10 2230 hw no serial', { qa_kind: 'Hardware', qa_ctrl: 'x', qa_dep: 'd' });
out['2230_hw_serial'] = await rec('QA RT r10 2230 hw serial', { qa_kind: 'Hardware', qa_serial: 'SN1', qa_ctrl: 'x', qa_dep: 'd' });
out['2230_sw_no_serial'] = await rec('QA RT r10 2230 sw', { qa_kind: 'Software', qa_ctrl: 'x', qa_dep: 'd' });
out['2231_ctrlZ_no_dep'] = await rec('QA RT r10 2231 ctrl Z', { qa_kind: 'Software', qa_ctrl: 'Z' });
out['2231_ctrlx_no_dep'] = await rec('QA RT r10 2231 ctrl x', { qa_kind: 'Software', qa_ctrl: 'x' });
// 2260: rollup on the QA module over Tickets with a relation that does not exist / doesn't point here
const TK = 'e8e5e302'; const tickets = arr((await api('o', 'GET', 'desk:/modules')).j?.data).find(x => x.id.startsWith(TK)).id;
const ru = await api('o', 'POST', `desk:/modules/${M}/fields`, { fields: [{ fieldName: 'qa_bad_rollup', labels: { en: 'QA bad rollup' }, datatypeKey: 'rollup_summary', required: false, unique: false, datatypeOptions: { target_module_id: tickets, relation_field: 'contact', target_field: 'subject', aggregation: 'count' } }] });
out['2260_rollup_foreign'] = short(ru);
const ru2 = await api('o', 'POST', `desk:/modules/${M}/fields`, { fields: [{ fieldName: 'qa_bad_rollup2', labels: { en: 'QA bad rollup2' }, datatypeKey: 'rollup_summary', required: false, unique: false, datatypeOptions: { target_module_id: tickets, relation_field: 'qa_nonexistent_lk', target_field: 'subject', aggregation: 'count' } }] });
out['2260_rollup_missing'] = short(ru2);
// 2387: read-only for Desk Agent on required Name
out['2387_hidden'] = short(await api('o', 'POST', `desk:/modules/${M}/field-permissions`, { fieldId: F('name').id, profileId: '44444444-4444-4444-4444-444444444402', permission: 'hidden' }));
out['2387_read_only'] = short(await api('o', 'POST', `desk:/modules/${M}/field-permissions`, { fieldId: F('name').id, profileId: '44444444-4444-4444-4444-444444444402', permission: 'read_only' }));
// 2232: department storage
const dms = (await api('o', 'GET', `desk:/modules/${DM}`)).j?.data; out.deptStorage = dms?.storageScope;
const DEPT = '9a7e391c'; const depts = arr((await api('o', 'GET', 'desk:/desk/departments')).j?.data); const dep = depts.find(d => d.id.startsWith(DEPT)) || depts[0]; out.dept = dep.name;
const dl = arr((await api('o', 'GET', `desk:/modules/${DM}/layouts`)).j?.data)[0]?.id;
const c1 = await api('o', 'POST', `desk:/modules/${DM}/records`, { layout_id: dl, data: [{ field: 'name', value: sv('QA RT r10 2232 no dept') }] }); out['2232_no_dept'] = short(c1);
const c2 = await api('o', 'POST', `desk:/modules/${DM}/records`, { layout_id: dl, department_id: dep.id, data: [{ field: 'name', value: sv('QA RT r10 2232 body dept') }] }); out['2232_body_dept'] = short(c2);
const g2 = c2.j?.data?.id ? (await api('o', 'GET', `desk:/modules/${DM}/records/${c2.j.data.id}`)).j?.data : null; out['2232_stored'] = g2 && JSON.stringify({ top: g2.department_id ?? g2.departmentId, f: (g2.data || []).find(x => /depart/.test(x.field)) }).slice(0, 200);
return out;
