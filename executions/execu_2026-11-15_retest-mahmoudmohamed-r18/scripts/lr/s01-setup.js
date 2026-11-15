const mid = await modId();
const pl = (n, vals, extra = {}) => ({ fieldName: FP + n, datatypeKey: 'pick_list', labels: { en: P + ' ' + n }, datatypeOptions: { allowed_values: vals }, config: { allowed_values: vals }, required: false, unique: false, uniquePeerModuleIds: [], ...extra });
const fx = (n, dt) => ({ fieldName: FP + n, datatypeKey: dt, labels: { en: P + ' ' + n }, datatypeOptions: {}, required: false, unique: false, uniquePeerModuleIds: [] });
const defs = [pl('type', ['Refund', 'Question', 'Partner', 'Other']), pl('tier', ['Gold', 'Silver', 'Bronze']), pl('filter', ['X', 'Y', 'Z', 'W']),
  fx('order', 'single_line'), fx('note', 'single_line'), fx('reason', 'single_line'), fx('text', 'single_line'), fx('amount', 'number'), fx('vip', 'checkbox'), fx('date', 'date'), fx('email2', 'email'), fx('tmp', 'single_line'),
  { ...pl('radio', ['Yes', 'No']), datatypeKey: 'radio_button' }];
const have = new Set((await fieldsOf(mid)).map(f => f.fieldName));
const nw = defs.filter(d => !have.has(d.fieldName));
if (nw.length) { const r = await api('POST', '/modules/' + mid + '/fields', { fields: nw }); log('fields', SR(r)); if (r.s >= 300) return 'stop'; LED('fields ' + nw.map(d => d.fieldName).join(',') + ' (Leads)'); }
const F = (await fieldsOf(mid)).filter(f => f.fieldName.startsWith(FP));
I.fields = Object.fromEntries(F.map(f => [f.fieldName, f.id])); SAVE();
const L = arr((await api('GET', '/modules/' + mid + '/layouts')).j.data);
let lay = L.find(x => x.name === P + ' Layout');
if (!lay) {
  const def = L.find(x => x.isDefault); const full = await getLayout(mid, def.id); const views = {};
  for (const [vk, v] of Object.entries(full.views || {})) {
    const lo = JSON.parse(JSON.stringify(v.layout));
    const mkSec = (sid, label, names) => ({ id: sid, label: { default: label, en: label }, tab_order: 'left_to_right', columns: [{ id: 'col-' + sid, column_order: 1, visibility: { mode: 'ALWAYS', field: null, op: null, value: null, visible: true, conditions: [] }, span: 2, fields: F.filter(f => names.includes(f.fieldName)).map(f => JSON.parse(JSON.stringify(f))) }] });
    lo.sections.push(mkSec('sec-qa-rt18-main', P + ' Main', ['type', 'tier', 'vip', 'radio', 'amount', 'text', 'date', 'filter', 'email2'].map(x => FP + x)));
    lo.sections.push(mkSec('sec-qa-rt18-a', P + ' Sec A', ['order', 'note', 'tmp'].map(x => FP + x)));
    lo.sections.push(mkSec('sec-qa-rt18-b', P + ' Sec B', [FP + 'reason']));
    views[vk] = { layout: lo };
  }
  const r = await api('POST', '/modules/' + mid + '/layouts', { name: P + ' Layout', description: 'QA RT18 retest', views, status: full.status, accessMode: full.accessMode, assignedProfiles: full.assignedProfiles });
  log('layout', SR(r).slice(0, 500)); if (r.s >= 300) return 'layout failed'; lay = r.j.data; LED('layout "QA RT18 Layout" ' + lay.id + ' (Leads)');
}
I.layout = lay.id; SAVE();
const g = await getLayout(mid, lay.id);
return { layout: lay.id, views: Object.fromEntries(Object.entries(g.views || {}).map(([k, v]) => [k, (v.layout.sections || []).map(s => s.id + ':' + s.columns.reduce((n, c) => n + c.fields.length, 0)).join(' ')])), fields: Object.keys(I.fields) };
