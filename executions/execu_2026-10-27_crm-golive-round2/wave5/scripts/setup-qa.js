// creates QA R2W5 Module + child with fields (hand checks); ids -> after/created.json
const TS = '5ea90671-4df5-4642-939d-49494f8e4d6e';
const res = {};
const mk = async (key, label) => { const r = await call('POST', `/teamspaces/${TS}/modules`, { moduleKey: key, labels: { en: label }, pluralForm: label, singularForm: label + ' record', description: 'QA R2W5 hand checks, deleted afterwards' }); return r.s === 201 ? r.j.data.id : 'ERR ' + r.s + ' ' + r.t.slice(0, 200); };
res.mod = await mk('qa_r2w5_mod', 'QA R2W5 Module');
res.child = await mk('qa_r2w5_child', 'QA R2W5 Child');
const f = (n, l, d, o) => ({ fieldName: n, labels: { en: l }, datatypeKey: d, required: false, unique: false, ...(o ? { datatypeOptions: o } : {}) });
const add = async (m, arr) => { const r = await call('POST', `/modules/${m}/fields`, { fields: arr }); return r.s + ' ' + (r.s >= 300 ? r.t.slice(0, 200) : ''); };
res.f1 = await add(res.mod, [f('qa_pick', 'QA Pick', 'pick_list', { allowed_values: ['Red', 'Green', 'Blue'] }), f('qa_sub', 'QA Sub pick', 'pick_list', { allowed_values: ['A', 'B', 'C'] }), f('qa_email', 'QA Email', 'email'), f('qa_num', 'QA Number', 'number'), f('qa_text', 'QA Text', 'single_line')]);
res.f2 = await add(res.mod, [f('qa_formula', 'QA Formula', 'formula', { expression: '1 + 1', return_kind: 'number' }), f('qa_auto', 'QA Auto', 'auto_number', { prefix: 'R5-', start_number: 1, padding: 4, increment: 1 })]);
res.f3 = await add(res.child, [f('qa_parent', 'QA Parent', 'lookup', { target_module_id: res.mod, related_list_title: 'QA children' }), f('qa_amount', 'QA Amount', 'number')]);
res.f4 = await add(res.mod, [f('qa_rollup', 'QA Rollup', 'rollup_summary', { target_module_id: res.child, relation_field: 'qa_parent', target_field: 'qa_amount', aggregation: 'sum' })]);
const L = async m => { const r = await call('GET', `/modules/${m}/layouts`); const d = Array.isArray(r.j.data) ? r.j.data : r.j.data.layouts; return d[0].id; };
res.layout = await L(res.mod); res.childLayout = await L(res.child);
return res;
