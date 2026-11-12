// SETUP: QA VR1112 fields (one per type) + a dedicated layout copied from the default, so rules can be scoped to it.
const mid = await modId();
const pl = (n, dt, vals) => ({ fieldName: 'qa_vr_' + n, datatypeKey: dt, labels: { en: P + ' ' + n }, datatypeOptions: { allowed_values: vals }, config: { allowed_values: vals }, required: false, unique: false, uniquePeerModuleIds: [] });
const fx = (n, dt) => ({ fieldName: 'qa_vr_' + n, datatypeKey: dt, labels: { en: P + ' ' + n }, datatypeOptions: {}, required: false, unique: false, uniquePeerModuleIds: [] });
const defs = [fx('text', 'single_line'), fx('note', 'single_line'), fx('num', 'number'), fx('dec', 'decimal'), fx('cur', 'currency'), fx('pct', 'percent'), fx('long', 'long_integer'),
  fx('date', 'date'), fx('dt', 'date_time'), pl('pick', 'pick_list', ['Open', 'Reject', 'Done']), pl('multi', 'multi_select', ['A', 'B', 'C']),
  fx('email', 'email'), fx('phone', 'phone'), fx('url', 'url'), fx('ml', 'multi_line'), fx('chk', 'checkbox')];
defs.push(pl('radio', 'radio_button', ['Yes', 'No']));
const have = new Set((await fieldsOf(mid)).map(f => f.fieldName));
for (const d of defs.filter(d => !have.has(d.fieldName))) { const r = await api('POST', '/modules/' + mid + '/fields', { fields: [d] }); log('field', d.fieldName, SR(r).slice(0, 200)); if (r.s < 300) LED('created field ' + d.fieldName); }
const F = (await fieldsOf(mid)).filter(f => f.fieldName.startsWith('qa_vr_'));
I.fields = Object.fromEntries(F.map(f => [f.fieldName, f.id])); SAVE();
log('caps', F.map(f => f.fieldName + ':' + (f.capabilities && f.capabilities.canCreateValidationRule)).join(' '));
const L = arr((await api('GET', '/modules/' + mid + '/layouts')).j.data);
let lay = L.find(x => x.name === P + ' Layout');
if (!lay) {
  const def = L.find(x => x.isDefault) || L[0]; const full = await getLayout(mid, def.id); const views = {};
  for (const [vk, v] of Object.entries(full.views || {})) {
    const lo = JSON.parse(JSON.stringify(v.layout));
    lo.sections.push({ id: 'sec-qa-vr-main', label: { default: P + ' Main', en: P + ' Main' }, tab_order: 'left_to_right', columns: [{ id: 'col-sec-qa-vr-main', column_order: 1, visibility: { mode: 'ALWAYS', field: null, op: null, value: null, visible: true, conditions: [] }, span: 2, fields: F.map(f => JSON.parse(JSON.stringify(f))) }] });
    views[vk] = { layout: lo };
  }
  const body = { name: P + ' Layout', description: 'QA validation rules test', views, status: full.status, accessMode: full.accessMode, assignedProfiles: full.assignedProfiles };
  if (APP === 'desk') Object.assign(body, { departmentIds: full.departmentIds, defaultDepartmentIds: full.defaultDepartmentIds, ticketStatuses: full.ticketStatuses, displayInHelpCenter: full.displayInHelpCenter });
  const r = await api('POST', '/modules/' + mid + '/layouts', body); log('layout create', SR(r).slice(0, 400));
  if (r.s >= 300) return 'layout failed'; lay = r.j.data; LED('created layout ' + lay.id);
}
I.layout = lay.id; I.defLayout = (L.find(x => x.isDefault) || L[0]).id; SAVE();
const g = await getLayout(mid, lay.id);
return { layout: lay.id, def: I.defLayout, fields: Object.keys(I.fields).length, depts: g.departmentIds, sections: Object.entries(g.views || {}).map(([k, v]) => k + ':' + v.layout.sections.length) };
