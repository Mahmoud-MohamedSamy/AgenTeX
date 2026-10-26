const L = 'bf971461-2edc-45f2-b6e4-6e180aa64288', M = MODS.leads, out = {}, made = [];
const mk = async (name, criteria, extra = {}) => { const r = await call('POST', `/modules/${M}/views`, { name, kind: 'list', layout_id: L, visibility: 'private', settings: { columns: ['first_name', 'phone', 'owner'], sort: { field: 'created_at', dir: 'desc' }, criteria, related_criteria: [] }, ...extra }); if (r.s < 300) made.push(r.j.data.id); return r; };
const c1 = await mk('QA W2 CV main', { pattern: '1 and 2', conditions: [{ field: 'first_name', operator: 'starts_with', value: 'QA W2' }, { field: 'phone', operator: 'is_not_empty', value: null }] });
out.create = c1.s + (c1.s >= 300 ? ' ' + c1.t.slice(0, 300) : '');
if (c1.s < 300) {
  const id = c1.j.data.id;
  const recs = await call('GET', `/modules/${M}/records?page=1&per_page=100&layout_id=${L}&view_id=${id}`);
  const names = (recs.j.data || []).map(x => (x.data.find(f => f.field === 'first_name') || {}).value?.value);
  out.viewRecords = recs.s + ' n=' + names.length + ' ' + JSON.stringify(names).slice(0, 200);
  const p = await call('PATCH', `/modules/${M}/views/${id}`, { name: 'QA W2 CV main renamed', row_version: c1.j.data.row_version }); out.rename = p.s + (p.s >= 300 ? ' ' + p.t.slice(0, 200) : '');
  const cl = await call('POST', `/modules/${M}/views/${id}/clone`, { name: 'QA W2 CV clone' }); out.clone = cl.s + (cl.s >= 300 ? ' ' + cl.t.slice(0, 200) : ''); if (cl.s < 300) made.push(cl.j.data.id);
  const pin = await call('PUT', `/modules/${M}/views/${id}/pin`, {}); out.pin = pin.s; const unpin = await call('DELETE', `/modules/${M}/views/${id}/pin`); out.unpin = unpin.s;
}
const up = await mk('QA W2 CV upper AND', { pattern: '1 AND 2', conditions: [{ field: 'first_name', operator: 'starts_with', value: 'QA' }, { field: 'phone', operator: 'is_not_empty', value: null }] });
out.upperAND = up.s + ' ' + up.t.slice(0, 200);
const bad = await mk('QA W2 CV bad pattern', { pattern: '1 and 3', conditions: [{ field: 'first_name', operator: 'starts_with', value: 'QA' }, { field: 'phone', operator: 'is_not_empty', value: null }] });
out.badPattern = bad.s + ' ' + bad.t.slice(0, 200);
const dup = await mk('QA W2 CV main renamed', null); out.duplicateName = dup.s + ' ' + dup.t.slice(0, 150);
const longn = await mk('QA W2 ' + 'L'.repeat(200), null); out.longName = longn.s + ' ' + longn.t.slice(0, 150);
globalThis.__cv = made;
return { out, made };
