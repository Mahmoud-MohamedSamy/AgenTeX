// CRM: module "QA FX Matrix" with a layout holding one formula field for every function x input field type pair.
// Re-runnable: skips what already exists. Result -> out/matrix.json. Usage: node fx.js matrix.js crm
const mods = L((await api('GET', '/modules')).j?.data);
const ACC = mods.find(m => m.moduleKey === 'accounts')?.id;
if (!made.mod) {
  const r = await api('POST', `/teamspaces/${TS}/modules`, { moduleKey: 'qa_fx_matrix', labels: { en: 'QA FX Matrix' }, pluralForm: 'QA FX Matrix', singularForm: 'QA FX Matrix record', description: 'Formula field matrix: every function x field type (24 Nov 2026)' });
  log('module', E(r)); if (r.s !== 201) return; made.mod = r.j.data.id; keep(); led('CRM module QA FX Matrix created ' + made.mod);
}
const M = made.mod;
// one input field per type
const T = [
  ['single_line', 'Single Line'], ['multi_line', 'Multi Line'], ['rich_text', 'Rich Text'], ['email', 'Email'], ['phone', 'Phone'], ['url', 'URL'],
  ['number', 'Number'], ['decimal', 'Decimal'], ['currency', 'Currency'], ['percent', 'Percent'], ['long_integer', 'Long Integer'], ['auto_number', 'Auto Number', { prefix: 'MX-', start_number: 1, padding: 3, increment: 1 }],
  ['checkbox', 'Checkbox'], ['pick_list', 'Pick List', { allowed_values: ['Red', 'Green', 'Blue'] }], ['radio_button', 'Radio', { allowed_values: ['A', 'B'] }], ['status', 'Status', { allowed_values: ['Open', 'Closed'] }], ['multi_select', 'Multi Select', { allowed_values: ['A', 'B', 'C'] }],
  ['date', 'Date'], ['date_time', 'Date Time'], ['lookup', 'Lookup', { target_module_id: ACC, related_list_title: 'QA FX Matrix' }], ['user', 'User'],
  ['address', 'Address'], ['location', 'Location'], ['file_upload', 'File'],
  ['camera', 'Camera'], ['image_upload', 'Image Upload'], ['map', 'Map'], ['multi_select_lookup', 'Multi-Select Lookup'], ['department', 'Department'], ['team', 'Team'], ['support_plan', 'Support Plan'], ['email_template', 'Email Template'], ['rollup_summary', 'Rollup Summary'],
  ['subform', 'Subform', { subfields: [{ key: 'qty', label: 'Qty', datatype: 'number' }, { key: 'price', label: 'Price', datatype: 'currency' }, { key: 'note', label: 'Note', datatype: 'single_line' }] }],
];
const inName = t => 'in_' + t;
let fields = L((await api('GET', `/modules/${M}/fields`)).j?.data); let have = new Set(fields.map(f => f.fieldName));
const res = { inputs: {}, pairs: {} };
for (const [k, lab, o] of T) { if (have.has(inName(k))) { res.inputs[k] = 'exists'; continue; }
  const r = await api('POST', `/modules/${M}/fields`, { fields: [fdef(inName(k), 'In ' + lab, k, o)] }); res.inputs[k] = E(r); }
// functions: [name, return kind, expression builder]. X = the input field; subform uses its columns
const SUB_NUM = 'in_subform.price', SUB_TXT = 'in_subform.note', SUB_AGG = 'sum(in_subform.price)';
const FN = [
  ['if', 'string', x => `if(isblank(${x}), "empty", "set")`],
  ['concat', 'string', x => `concat("[", ${x}, "]")`],
  ['coalesce', 'string', x => `coalesce(${x}, "none")`],
  ['min', 'number', (x, s) => s ? `min(${SUB_NUM})` : `min(${x}, 100)`],
  ['max', 'number', (x, s) => s ? `max(${SUB_NUM})` : `max(${x}, 0)`],
  ['sum', 'number', (x, s) => s ? `sum(${SUB_NUM})` : `sum(${x}, 1)`],
  ['avg', 'number', (x, s) => s ? `avg(${SUB_NUM})` : `avg(${x}, 0)`],
  ['count', 'number', (x, s) => s ? `count(in_subform)` : `count(${x})`],
  ['upper', 'string', x => `upper(${x})`],
  ['lower', 'string', x => `lower(${x})`],
  ['trim', 'string', x => `trim(${x})`],
  ['len', 'number', x => `len(${x})`],
  ['abs', 'number', x => `abs(${x})`],
  ['round', 'number', x => `round(${x}, 1)`],
  ['isblank', 'boolean', x => `isblank(${x})`],
  ['number', 'number', x => `number(${x})`],
  ['text', 'string', x => `text(${x})`],
  ['daysbetween', 'number', (x, s) => `daysbetween(${s ? 'in_date' : x}, in_date)`],
  ['hoursbetween', 'number', (x, s) => `hoursbetween(${s ? 'in_date_time' : x}, in_date_time)`],
];
const AGG = new Set(['min', 'max', 'sum', 'avg', 'count']);
const fxName = (f, t) => `fx_${f}_${t}`.slice(0, 60);
for (const [f, kind, b] of FN) {
  for (const [t, lab] of T) {
    const n = fxName(f, t), key = f + ' x ' + t;
    const sub = t === 'subform'; const x = sub ? (AGG.has(f) ? null : (['upper', 'lower', 'trim', 'len'].includes(f) ? `text(${SUB_AGG})` : SUB_AGG)) : inName(t);
    const expr = b(x, sub);
    if (have.has(n)) { res.pairs[key] = { field: n, expr, s: 'exists' }; continue; }
    const r = await api('POST', `/modules/${M}/fields`, { fields: [fdef(n, `${f}() · ${lab}`, 'formula', { expression: expr, return_kind: kind })] });
    res.pairs[key] = { field: n, expr, kind, s: r.s, err: r.s >= 300 ? E(r).slice(0, 220) : '' };
  }
  log(f, Object.entries(res.pairs).filter(([k]) => k.startsWith(f + ' x ')).map(([, v]) => v.s).join(' '));
}
// layout: rename default layout, keep system section, add Inputs + one section per function
fields = L((await api('GET', `/modules/${M}/fields`)).j?.data); const byName = Object.fromEntries(fields.map(f => [f.fieldName, f]));
const ls = (x => Array.isArray(x) ? x : x.layouts)((await api('GET', `/modules/${M}/layouts`)).j.data); const LID = (ls.find(l => l.isDefault) || ls[0]).id; made.layout = LID; keep();
const lay = (await api('GET', `/modules/${M}/layouts/${LID}`)).j.data;
const mkF = (f, i) => ({ id: f.id, fieldName: f.fieldName, apiName: f.fieldName, labels: f.labels, datatypeKey: f.datatypeKey, fieldOrder: i, config: { required: false, unique: false, ...(f.datatypeOptions || {}) } });
const vis = { mode: 'always', field: null, op: null, value: null, visible: true, conditions: null };
const sec = (label, list) => { const sid = crypto.randomUUID(), half = Math.ceil(list.length / 2);
  return { id: sid, label: { en: label }, columns: [0, 1].map(c => ({ id: sid + '-col-' + c, column_order: c, visibility: vis, span: 1, fields: (c ? list.slice(half) : list.slice(0, half)).map(mkF) })), tab_order: null }; };
const mine = n => /^(in_|fx_)/.test(n);
const inputs = [...T.map(([t]) => byName[inName(t)]), byName.in_parent].filter(Boolean);
const fnSecs = FN.map(([f]) => [f, T.map(([t]) => byName[fxName(f, t)]).filter(Boolean)]).filter(([, l]) => l.length);
const body = { name: 'QA FX Formula Matrix', views: JSON.parse(JSON.stringify(lay.views)), assignedProfiles: lay.assignedProfiles, status: lay.status, accessMode: lay.accessMode, rowVersion: lay.rowVersion, description: 'One formula field per function x field type (19 functions x 34 types)' };
for (const v of Object.keys(body.views)) { if (v === 'QUICK_CREATE') continue; const L0 = body.views[v].layout;
  L0.sections = L0.sections.map(s => ({ ...s, columns: s.columns.map(c => ({ ...c, fields: c.fields.filter(f => !mine(f.fieldName)) })) })).filter(s => !/^(Inputs|fx )/.test(s.label?.en || ''));
  L0.sections.push(sec('Inputs (one field per type)', inputs));
  for (const [f, l] of fnSecs) L0.sections.push(sec(`fx ${f}()`, l)); }
const p = await api('PUT', `/modules/${M}/layouts/${LID}`, body); res.layoutPut = E(p).slice(0, 400);
const after = (await api('GET', `/modules/${M}/layouts/${LID}`)).j.data;
res.layout = { id: LID, name: after.name, sections: after.views.DETAIL?.layout.sections.map(s => s.label.en + ':' + s.columns.reduce((a, c) => a + c.fields.length, 0)) };
led(`CRM QA FX Matrix: ${inputs.length} inputs, ${fnSecs.reduce((a, [, l]) => a + l.length, 0)} formula fields placed, layout ${LID} ${res.layoutPut.slice(0, 3)}`);
fs.writeFileSync(RUN + '/out/matrix.json', JSON.stringify(res, null, 1));
const refused = Object.entries(res.pairs).filter(([, v]) => typeof v.s === 'number' && v.s >= 300);
log({ inputs: res.inputs, created: Object.values(res.pairs).filter(v => v.s < 300 || v.s === 'exists').length, refused: refused.length, layout: res.layout, put: res.layoutPut });
