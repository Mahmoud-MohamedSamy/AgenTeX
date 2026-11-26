// Split the matrix into two layouts (512-field limit per layout). Layout 1 = existing default, Layout 2 = new.
const M = made.mod, LID = made.layout;
const fields = L((await api('GET', `/modules/${M}/fields`)).j?.data); const byName = Object.fromEntries(fields.map(f => [f.fieldName, f]));
const TYPES = ['single_line', 'multi_line', 'rich_text', 'email', 'phone', 'url', 'number', 'decimal', 'currency', 'percent', 'long_integer', 'auto_number', 'checkbox', 'pick_list', 'radio_button', 'status', 'multi_select', 'date', 'date_time', 'lookup', 'user', 'address', 'location', 'file_upload', 'camera', 'image_upload', 'map', 'multi_select_lookup', 'department', 'team', 'support_plan', 'email_template', 'rollup_summary', 'subform'];
const G1 = ['if', 'concat', 'coalesce', 'min', 'max', 'sum', 'avg', 'count', 'upper', 'lower'];
const G2 = ['trim', 'len', 'abs', 'round', 'isblank', 'number', 'text', 'daysbetween', 'hoursbetween'];
const inputs = [...TYPES.map(t => byName['in_' + t]), byName.in_parent].filter(Boolean);
const mkF = (f, i) => ({ id: f.id, fieldName: f.fieldName, apiName: f.fieldName, labels: f.labels, datatypeKey: f.datatypeKey, fieldOrder: i, config: { required: false, unique: false, ...(f.datatypeOptions || {}) } });
const vis = { mode: 'always', field: null, op: null, value: null, visible: true, conditions: null };
const sec = (label, list) => { const sid = crypto.randomUUID(), half = Math.ceil(list.length / 2);
  return { id: sid, label: { en: label }, columns: [0, 1].map(c => ({ id: sid + '-col-' + c, column_order: c, visibility: vis, span: 1, fields: (c ? list.slice(half) : list.slice(0, half)).map(mkF) })), tab_order: null }; };
const mine = n => /^(in_|fx_)/.test(n);
const lay = (await api('GET', `/modules/${M}/layouts/${LID}`)).j.data;
const build = (views, G, fresh) => { const v2 = JSON.parse(JSON.stringify(views));
  for (const v of Object.keys(v2)) { if (fresh) v2[v].id = crypto.randomUUID(); if (v === 'QUICK_CREATE') continue; const L0 = v2[v].layout;
    L0.sections = L0.sections.filter(s => !/^(Inputs|fx )/.test(s.label?.en || '')).map(s => ({ ...s, ...(fresh ? { id: crypto.randomUUID() } : {}), columns: s.columns.map(c => ({ ...c, fields: c.fields.filter(f => !mine(f.fieldName)) })) }));
    if (fresh) L0.sections.forEach(s => s.columns.forEach((c, i) => c.id = s.id + '-col-' + i));
    L0.sections.push(sec('Inputs (one field per type)', inputs));
    for (const f of G) { const l = TYPES.map(t => byName[`fx_${f}_${t}`]).filter(Boolean); if (l.length) L0.sections.push(sec(`fx ${f}()`, l)); } }
  return v2; };
const res = {};
const b1 = { name: 'QA FX Formula Matrix 1', views: build(lay.views, G1, false), assignedProfiles: lay.assignedProfiles, status: lay.status, accessMode: lay.accessMode, rowVersion: lay.rowVersion, description: 'Formula matrix part 1: ' + G1.join(', ') + ' x 34 field types' };
res.put1 = E(await api('PUT', `/modules/${M}/layouts/${LID}`, b1)).slice(0, 400);
if (!made.layout2) {
  const b2 = { name: 'QA FX Formula Matrix 2', views: build(lay.views, G2, true), assignedProfiles: lay.assignedProfiles, status: lay.status, accessMode: lay.accessMode, description: 'Formula matrix part 2: ' + G2.join(', ') + ' x 34 field types' };
  const r = await api('POST', `/modules/${M}/layouts`, b2); res.post2 = E(r).slice(0, 500);
  if (r.s < 300) { made.layout2 = r.j?.data?.id; keep(); led('CRM QA FX Matrix layout 2 created ' + made.layout2); }
}
const cnt = s => s.columns.reduce((a, c) => a + c.fields.length, 0);
for (const id of [LID, made.layout2].filter(Boolean)) { const d = (await api('GET', `/modules/${M}/layouts/${id}`)).j.data;
  res[id] = { name: d.name, status: d.status, isDefault: d.isDefault, profiles: (d.assignedProfiles || []).length, total: d.views.DETAIL.layout.sections.reduce((a, s) => a + cnt(s), 0), sections: d.views.DETAIL.layout.sections.map(s => s.label.en + ':' + cnt(s)).join(', ') }; }
fs.writeFileSync(RUN + '/out/split.json', JSON.stringify(res, null, 1)); log(res);
