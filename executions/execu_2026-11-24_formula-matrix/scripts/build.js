// Generic builder. env SPEC=matrix|ops, app from fx.js arg (crm|desk). Creates module + 34 input types (+ self lookup, rollup) + formulas from the spec.
// State in made[SPEC] = { mod, layout, layout2 }. Result -> out/build-<app>-<spec>.json
const SPEC = process.env.SPEC || 'matrix';
const isDesk = !!process.env.DESK; const st = (made[SPEC] ||= {});
const mods = L((await api('GET', '/modules')).j?.data);
const ACC = mods.find(m => m.moduleKey === (isDesk ? 'desk_accounts' : 'accounts'))?.id;
const TSID = isDesk ? 'a641f1df-f2c6-450e-a881-857776dacf70' : TS;
const KEY = (isDesk ? 'qa_fx_dmx' : 'qa_fx_mx') + (SPEC === 'ops' ? '_ops' : ''), LABEL = 'QA FX Matrix' + (SPEC === 'ops' ? ' Ops' : '') + (isDesk ? ' Desk' : '');
if (!st.mod) { const ex = mods.find(m => m.labels?.en === LABEL || m.moduleKey === KEY);
  if (ex) st.mod = ex.id; else { const r = await api('POST', `/teamspaces/${TSID}/modules`, { moduleKey: KEY, labels: { en: LABEL }, pluralForm: LABEL, singularForm: LABEL + ' record', description: 'Formula ' + SPEC + ' test, 24 Nov 2026 (kept)' });
    log('module', E(r)); if (r.s !== 201) return; st.mod = r.j.data.id; led(`${isDesk ? 'Desk' : 'CRM'} module ${LABEL} created ${st.mod}`); } keep(); }
const M = st.mod;
const T = [['single_line', 'Single Line'], ['multi_line', 'Multi Line'], ['rich_text', 'Rich Text'], ['email', 'Email'], ['phone', 'Phone'], ['url', 'URL'],
  ['number', 'Number'], ['decimal', 'Decimal'], ['currency', 'Currency'], ['percent', 'Percent'], ['long_integer', 'Long Integer'], ['auto_number', 'Auto Number', { prefix: 'MX-', start_number: 1, padding: 3, increment: 1 }],
  ['checkbox', 'Checkbox'], ['pick_list', 'Pick List', { allowed_values: ['Red', 'Green', 'Blue'] }], ['radio_button', 'Radio', { allowed_values: ['A', 'B'] }], ['status', 'Status', { allowed_values: ['Open', 'Closed'] }], ['multi_select', 'Multi Select', { allowed_values: ['A', 'B', 'C'] }],
  ['date', 'Date'], ['date_time', 'Date Time'], ['lookup', 'Lookup', { target_module_id: ACC, related_list_title: LABEL }], ['user', 'User'],
  ['address', 'Address'], ['location', 'Location'], ['file_upload', 'File'], ['camera', 'Camera'], ['image_upload', 'Image Upload'], ['map', 'Map'], ['multi_select_lookup', 'Multi-Select Lookup', { target_module_id: ACC, related_list_title: LABEL + ' MSL' }],
  ['department', 'Department'], ['team', 'Team'], ['support_plan', 'Support Plan'], ['email_template', 'Email Template'],
  ['subform', 'Subform', { subfields: [{ key: 'qty', label: 'Qty', datatype: 'number' }, { key: 'price', label: 'Price', datatype: 'currency' }, { key: 'note', label: 'Note', datatype: 'single_line' }] }]];
let fields = L((await api('GET', `/modules/${M}/fields`)).j?.data); let have = new Set(fields.map(f => f.fieldName)); const res = { inputs: {}, pairs: {} };
for (const [k, lab, o] of T) if (!have.has('in_' + k)) res.inputs[k] = E(await api('POST', `/modules/${M}/fields`, { fields: [fdef('in_' + k, 'In ' + lab, k, o)] })).slice(0, 200);
if (!have.has('in_parent')) res.inputs.parent = E(await api('POST', `/modules/${M}/fields`, { fields: [fdef('in_parent', 'In Parent (self lookup)', 'lookup', { target_module_id: M, related_list_title: LABEL + ' children' })] })).slice(0, 200);
if (!have.has('in_rollup_summary')) res.inputs.rollup = E(await api('POST', `/modules/${M}/fields`, { fields: [fdef('in_rollup_summary', 'In Rollup Summary', 'rollup_summary', { target_module_id: M, relation_field: 'in_parent', target_field: 'in_number', aggregation: 'sum' })] })).slice(0, 200);
const SUB_NUM = 'in_subform.price', SUB_AGG = 'sum(in_subform.price)';
const FNS = {
  matrix: [['if', 'string', x => `if(isblank(${x}), "empty", "set")`], ['concat', 'string', x => `concat("[", ${x}, "]")`], ['coalesce', 'string', x => `coalesce(${x}, "none")`],
    ['min', 'number', (x, s) => s ? `min(${SUB_NUM})` : `min(${x}, 100)`], ['max', 'number', (x, s) => s ? `max(${SUB_NUM})` : `max(${x}, 0)`], ['sum', 'number', (x, s) => s ? `sum(${SUB_NUM})` : `sum(${x}, 1)`],
    ['avg', 'number', (x, s) => s ? `avg(${SUB_NUM})` : `avg(${x}, 0)`], ['count', 'number', (x, s) => s ? `count(in_subform)` : `count(${x})`], ['upper', 'string', x => `upper(${x})`], ['lower', 'string', x => `lower(${x})`],
    ['trim', 'string', x => `trim(${x})`], ['len', 'number', x => `len(${x})`], ['abs', 'number', x => `abs(${x})`], ['round', 'number', x => `round(${x}, 1)`], ['isblank', 'boolean', x => `isblank(${x})`],
    ['number', 'number', x => `number(${x})`], ['text', 'string', x => `text(${x})`],
    ['daysbetween', 'number', (x, s) => `round(daysbetween(${s ? 'in_date' : x}, in_date))`], ['hoursbetween', 'number', (x, s) => `round(hoursbetween(${s ? 'in_date_time' : x}, in_date_time))`]],
  ops: [['add', 'number', x => `${x} + 1`], ['sub', 'number', x => `${x} - 1`], ['mul', 'number', x => `${x} * 2`], ['div', 'number', x => `${x} / 2`], ['mod', 'number', x => `${x} % 3`],
    ['amp', 'string', x => `${x} & "!"`], ['eq', 'boolean', x => `${x} = ${x}`], ['ne', 'boolean', x => `${x} != ${x}`], ['gt', 'boolean', x => `${x} > ${x}`], ['ge', 'boolean', x => `${x} >= ${x}`],
    ['lt', 'boolean', x => `${x} < ${x}`], ['le', 'boolean', x => `${x} <= ${x}`], ['and', 'boolean', x => `${x} && true`], ['or', 'boolean', x => `${x} || false`], ['not', 'boolean', x => `!${x}`],
    ['iftruthy', 'string', x => `if(${x}, "truthy", "falsy")`], ['cnum', 'string', x => `concat(${x}, "|", in_number)`], ['cif', 'string', x => `if(in_checkbox, ${x}, "off")`],
    ['ccoal', 'string', x => `coalesce(${x}, in_single_line)`], ['cnest', 'string', x => `upper(trim(concat(${x}, " ")))`], ['cnum2', 'number', x => `round(abs(number(${x})) * 2, 0)`],
    ['clen', 'boolean', x => `len(text(${x})) > 0`], ['ccnt', 'number', x => `if(isblank(${x}), 0, 1) + if(isblank(in_number), 0, 1)`], ['cmix', 'string', x => `${x} & " / " & in_date & " / " & in_checkbox`]],
};
const FN = FNS[SPEC]; const AGG = new Set(['min', 'max', 'sum', 'avg', 'count']); const TT = T.map(t => t[0]);
const fxName = (f, t) => `fx_${f}_${t}`.slice(0, 60);
for (const [f, kind, b] of FN) { const sts = [];
  for (const [t, lab] of T) { const n = fxName(f, t), key = f + ' x ' + t; const sub = t === 'subform';
    const x = sub ? (SPEC === 'matrix' && AGG.has(f) ? null : (['upper', 'lower', 'trim', 'len'].includes(f) ? `text(${SUB_AGG})` : SUB_AGG)) : 'in_' + t;
    const expr = b(x, sub && SPEC === 'matrix'); if (have.has(n)) { res.pairs[key] = { field: n, expr, s: 'exists' }; sts.push('e'); continue; }
    const r = await api('POST', `/modules/${M}/fields`, { fields: [fdef(n, `${f}() · ${lab}`, 'formula', { expression: expr, return_kind: kind })] });
    res.pairs[key] = { field: n, expr, kind, s: r.s, err: r.s >= 300 ? E(r).slice(0, 220) : '' }; sts.push(r.s); }
  log(f, sts.join(' ')); }
fs.writeFileSync(RUN + `/out/build-${isDesk ? 'desk' : 'crm'}-${SPEC}.json`, JSON.stringify(res, null, 1));
const P = Object.values(res.pairs); log({ module: M, inputs: res.inputs, created: P.filter(p => p.s === 201).length, exists: P.filter(p => p.s === 'exists').length, refused: P.filter(p => typeof p.s === 'number' && p.s >= 300).map(p => p.field + ' ' + p.err.slice(0, 90)) });
