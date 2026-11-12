// SETUP: QA LR1112 fields + a dedicated layout (copy of the default) with 3 extra sections
const mid = await modId();
const pl = (n, vals, extra = {}) => ({ fieldName: 'qa_lr_' + n, datatypeKey: 'pick_list', labels: { en: P + ' ' + n }, datatypeOptions: { allowed_values: vals }, config: { allowed_values: vals }, required: false, unique: false, uniquePeerModuleIds: [], ...extra });
const fx = (n, dt) => ({ fieldName: 'qa_lr_' + n, datatypeKey: dt, labels: { en: P + ' ' + n }, datatypeOptions: {}, required: false, unique: false, uniquePeerModuleIds: [] });
const defs = [
  pl('type', ['Refund', 'Question', 'Partner', 'Other']),
  pl('tier', ['Gold', 'Silver', 'Bronze']),
  pl('filter', ['X', 'Y', 'Z', 'W']),
  fx('order', 'single_line'), fx('note', 'single_line'), fx('reason', 'single_line'), fx('text', 'single_line'),
  fx('amount', 'number'), fx('vip', 'checkbox'), fx('date', 'date'), fx('email2', 'email'),
  { ...pl('tags', ['A', 'B', 'C']), datatypeKey: 'multi_select' },
];
if (APP === 'crm') defs.push({ ...pl('radio', ['Yes', 'No']), datatypeKey: 'radio_button' });
const have = new Set((await fieldsOf(mid)).map(f => f.fieldName));
const nw = defs.filter(d => !have.has(d.fieldName));
if (nw.length) { const r = await api('POST', '/modules/' + mid + '/fields', { fields: nw }); log('fields', SR(r)); if (r.s >= 300) return 'stop'; LED('created fields ' + nw.map(d => d.fieldName).join(',')); }
const F = (await fieldsOf(mid)).filter(f => f.fieldName.startsWith('qa_lr_'));
I.fields = Object.fromEntries(F.map(f => [f.fieldName, f.id])); SAVE();
// layout
const L = arr((await api('GET', '/modules/' + mid + '/layouts')).j.data);
let lay = L.find(x => x.name === P + ' Layout');
if (!lay) {
  const def = L.find(x => x.isDefault) || L[0]; const full = await getLayout(mid, def.id);
  const views = {};
  for (const [vk, v] of Object.entries(full.views || {})) {
    const lo = JSON.parse(JSON.stringify(v.layout));
    const mkSec = (sid, label, names) => ({ id: sid, label: { default: label, en: label }, tab_order: 'left_to_right', columns: [{ id: 'col-' + sid, column_order: 1, visibility: { mode: 'ALWAYS', field: null, op: null, value: null, visible: true, conditions: [] }, span: 2, fields: F.filter(f => names.includes(f.fieldName)).map(f => JSON.parse(JSON.stringify(f))) }] });
    if (vk !== 'QUICK_CREATE' || true) {
      lo.sections.push(mkSec('sec-qa-lr-main', P + ' Main', ['qa_lr_type', 'qa_lr_tier', 'qa_lr_vip', 'qa_lr_radio', 'qa_lr_amount', 'qa_lr_text', 'qa_lr_date', 'qa_lr_tags', 'qa_lr_filter', 'qa_lr_email2']));
      lo.sections.push(mkSec('sec-qa-lr-a', P + ' Sec A', ['qa_lr_order', 'qa_lr_note']));
      lo.sections.push(mkSec('sec-qa-lr-b', P + ' Sec B', ['qa_lr_reason']));
    }
    views[vk] = { layout: lo };
  }
  const body = { name: P + ' Layout', description: 'QA layout rules test', views, status: full.status, accessMode: full.accessMode, assignedProfiles: full.assignedProfiles }; if (APP === 'desk') Object.assign(body, { departmentIds: full.departmentIds, defaultDepartmentIds: full.defaultDepartmentIds, ticketStatuses: full.ticketStatuses, displayInHelpCenter: full.displayInHelpCenter });
  const r = await api('POST', '/modules/' + mid + '/layouts', body);
  log('layout create', SR(r), JSON.stringify(r.j?.data ? { id: r.j.data.id } : r.t).slice(0, 600));
  if (r.s >= 300) return 'layout failed';
  lay = r.j.data; LED('created layout ' + lay.id);
}
I.layout = lay.id; I.defLayout = (L.find(x => x.isDefault) || L[0]).id; SAVE();
const g = await getLayout(mid, lay.id);
return { layout: lay.id, views: Object.fromEntries(Object.entries(g.views || {}).map(([k, v]) => [k, (v.layout.sections || []).map(s => s.id + ':' + s.columns.reduce((n, c) => n + c.fields.length, 0)).join(' ')])), fields: Object.keys(I.fields).length, depts: g.departmentIds };
