const mid = await modId(); const FP = 'qa_rt18v_';
const fx = (n, dt, vals) => ({ fieldName: FP + n, datatypeKey: dt, labels: { en: P + ' v ' + n }, datatypeOptions: vals ? { allowed_values: vals } : {}, ...(vals ? { config: { allowed_values: vals } } : {}), required: false, unique: false, uniquePeerModuleIds: [] });
const defs = [fx('text', 'single_line'), fx('note', 'single_line'), fx('pick', 'pick_list', ['Open', 'Reject', 'Done']), fx('email', 'email')];
const have = new Set((await fieldsOf(mid)).map(f => f.fieldName)); const o = {};
for (const d of defs.filter(d => !have.has(d.fieldName))) { const r = await api('POST', '/modules/' + mid + '/fields', { fields: [d] }); o[d.fieldName] = SR(r).slice(0, 150); }
const F = (await fieldsOf(mid)).filter(f => f.fieldName.startsWith(FP)); I.fields = Object.fromEntries(F.map(f => [f.fieldName, f.id])); SAVE();
LED('fields ' + Object.keys(I.fields).join(',') + ' (Leads)');
const L = arr((await api('GET', '/modules/' + mid + '/layouts')).j.data); let lay = L.find(x => x.name === P + ' VR Layout');
if (!lay) { const def = L.find(x => x.isDefault); const full = await getLayout(mid, def.id); const views = {};
  for (const [vk, v] of Object.entries(full.views || {})) { const lo = JSON.parse(JSON.stringify(v.layout)); lo.sections.push({ id: 'sec-qa-rt18v', label: { default: P + ' VR', en: P + ' VR' }, tab_order: 'left_to_right', columns: [{ id: 'col-sec-qa-rt18v', column_order: 1, visibility: { mode: 'ALWAYS', field: null, op: null, value: null, visible: true, conditions: [] }, span: 2, fields: F.map(f => JSON.parse(JSON.stringify(f))) }] }); views[vk] = { layout: lo }; }
  const r = await api('POST', '/modules/' + mid + '/layouts', { name: P + ' VR Layout', description: 'QA RT18 validation retest', views, status: full.status, accessMode: full.accessMode, assignedProfiles: full.assignedProfiles });
  o.layout = SR(r).slice(0, 300); if (r.s >= 300) return o; lay = r.j.data; LED('layout "QA RT18 VR Layout" ' + lay.id + ' (Leads)'); }
I.layout = lay.id; I.defLayout = L.find(x => x.isDefault).id; SAVE(); o.lay = lay.id; o.fields = I.fields;
// smoke record
const rec = await mkRec(mid, { first_name: 'QA', last_name: P + ' VR smoke', qa_rt18v_text: 'ok' }, lay.id); o.smoke = rec.s + ' ' + rec.err.slice(0, 200);
return o;
