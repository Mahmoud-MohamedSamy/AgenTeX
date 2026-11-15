const mid = await modId(); const L = I.layout; const PROF = '11111111-1111-1111-1111-111111111103'; const o = {}; const M = process.env.FPM;
if (!I.rH6) {
  const k = (await getRule(mid, I.rK3)).j.data; const off = await putRule(mid, I.rK3, { ...k, status: 'disabled' }); o.k3off = off.s; LED('changed validation rule QA RT18 K3 -> disabled (to free qa_rt18v_note) (Leads)');
  const r = await mkRule(mid, { name: P + ' H6 note required', layoutId: L, primaryField: 'qa_rt18v_note', branches: [B(C('isEmpty', 'qa_rt18v_note'), 'QA RT18 H6 note is required')] }); o.rule = SR(r).slice(0, 200); if (!(r.j && r.j.data)) return o; I.rH6 = r.j.data.id; SAVE();
}
const ex = arr((await api('GET', '/modules/' + mid + '/field-permissions')).j.data).filter(x => x.fieldId === I.fields.qa_rt18v_note); o.before = ex.map(x => x.profileId.slice(-3) + ':' + x.permission);
for (const x of ex) await api('DELETE', '/modules/' + mid + '/field-permissions/' + x.id);
const fp = await api('POST', '/modules/' + mid + '/field-permissions', { fieldId: I.fields.qa_rt18v_note, profileId: PROF, permission: M }); o.fp = SR(fp).slice(0, 200);
if (fp.j && fp.j.data) { I.fpH6 = fp.j.data.id; SAVE(); LED('field permission qa_rt18v_note ' + M + ' for profile User ' + fp.j.data.id + ' (Leads) — before: none'); }
const own = await mkRec(mid, { first_name: 'QA', last_name: P + ' H6 owner ' + M }, L); o.owner = own.s + ' ' + own.err.slice(0, 160);
return o;
