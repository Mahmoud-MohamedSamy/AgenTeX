// NDC-2647 setup: child module with lookup + amount, rollup sum on QA RT r8; parent record = Red/A record.
const TS = '5ea90671-4df5-4642-939d-49494f8e4d6e', M = '064aa360-7e4b-4e0b-9e68-831c469fa6e9', PARENT = '22ab5b7b-ffe7-4414-b22c-707fe176a1a5'; const out = {};
const enc = v => typeof v === 'number' ? { kind: 'number', value: v } : { kind: 'string', value: String(v) };
let ch = arr((await api('GET', '/modules')).j?.data).find(m => m.moduleKey === 'qa_rt_r8c');
if (!ch) { const r = await api('POST', `/teamspaces/${TS}/modules`, { moduleKey: 'qa_rt_r8c', labels: { en: 'QA RT r8 child' }, pluralForm: 'QA RT r8 child', singularForm: 'QA RT r8 child record', description: 'QA retest round 8, deleted afterwards' }); ch = r.j?.data; out.child = r.s; }
const C = ch.id; out.childId = C;
out.lookup = (await api('POST', `/modules/${C}/fields`, { fields: [{ fieldName: 'qa_parent', labels: { en: 'QA Parent' }, datatypeKey: 'lookup', required: false, unique: false, datatypeOptions: { target_module_id: M, related_list_title: 'QA children' } }] })).s;
out.amount = (await api('POST', `/modules/${C}/fields`, { fields: [{ fieldName: 'qa_amount', labels: { en: 'QA Amount' }, datatypeKey: 'number', required: false, unique: false }] })).s;
const ro = await api('POST', `/modules/${M}/fields`, { fields: [{ fieldName: 'qa_rollup', labels: { en: 'QA Rollup sum' }, datatypeKey: 'rollup_summary', required: false, unique: false, datatypeOptions: { target_module_id: C, relation_field: 'qa_parent', target_field: 'qa_amount', aggregation: 'sum' } }] }); out.rollup = ro.s + ' ' + (ro.s >= 300 ? ro.t.slice(0, 200) : '');
const cl = arr((await api('GET', `/modules/${C}/layouts`)).j?.data)[0]?.id;
for (const a of [5, 7]) { const r = await api('POST', `/modules/${C}/records`, { layout_id: cl, data: [['name', 'QA RT r8 child ' + a], ['qa_amount', a], ['qa_parent', PARENT]].map(([f, v]) => ({ field: f, value: enc(v) })) }); out['child' + a] = r.s + ' ' + (r.s >= 300 ? r.t.slice(0, 200) : ''); }
await sleep(5000);
const g = (await api('GET', `/modules/${M}/records/${PARENT}`)).j?.data?.data || []; out.rollupOnRecord = JSON.stringify(g.find(x => x.field === 'qa_rollup')?.value);
const reps = arr((await api('GET', '/reporting/reports')).j?.data); out.reports = reps.length; const r0 = reps[0]; out.repSample = r0 && JSON.stringify((await api('GET', '/reporting/reports/' + r0.id)).j?.data).slice(0, 1800);
return done(out);
