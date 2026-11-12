// Field types the editor hides: can the API still create and enforce them?
const mid = await modId(); const L = I.layout; const base = I.base; const isDesk = APP === 'desk'; const out = [];
const raw = (vals) => api('POST', '/modules/' + mid + '/records', { data: Object.entries({ ...base, ...vals }).map(([k, v]) => ({ field: k, value: enc(v) })), layout_id: L });
const tries = isDesk ? [['Z2', 'qa_vr_chk', C('eq', 'qa_vr_chk', true), { qa_vr_chk: true }, { qa_vr_chk: false }], ['Z3', 'status', C('eq', 'status', 'Closed'), { status: 'Closed' }, { status: 'Open' }], ['Z4', 'contact_id', C('isNull', 'contact_id'), { contact_id: null }, {}]]
  : [['Z1', 'connected_to', C('isNotNull', 'connected_to'), null, {}], ['Z1b', 'qa_vr_chk', C('eq', 'qa_vr_chk', true), { qa_vr_chk: true }, { qa_vr_chk: false }], ['Z1c', 'lead_status', C('eq', 'lead_status', 'x'), null, {}]];
const F = await fieldsOf(mid);
for (const [id, pf, check, bad, good] of tries) {
  const cap = (F.find(f => f.fieldName === pf) || {}).capabilities; const r = await mkRule(mid, { name: P + ' ' + id + ' api', layoutId: L, primaryField: pf, branches: [B(check, 'QA ' + id + ' hidden type')] });
  let s = `${id} ${pf}: canCreateValidationRule=${cap && cap.canCreateValidationRule}; API create -> ${SR(r).slice(0, 160)}`;
  if (r.s < 300) { if (bad) { const a = await raw(bad); s += `; bad -> ${a.s}`; } const b = await raw(good); s += `; good -> ${b.s} ${E(b).slice(0, 100)}`; await delRule(mid, r.j.data.id); }
  out.push(s); RES(id + '-api', 'INFO', s);
}
return out;
