const mid = await modId(); const lid = I.layout; const out = {}; const f = x => FP + x; const cm = await modId('contacts');
// 2974 mass update of primary field without rule-mandatory order
const a = await mkRec(mid, { first_name: P + ' mass1', last_name: P + ' mass1', qa_rt18_type: 'Question' }, lid); const b = await mkRec(mid, { first_name: P + ' mass2', last_name: P + ' mass2', qa_rt18_type: 'Question' }, lid);
out.recs = [a.s + ' ' + a.id + ' ' + a.err, b.s + ' ' + b.id];
const single = await api('PATCH', '/modules/' + mid + '/records/' + a.id, { data: [{ field: f('type'), value: enc('Refund') }] }); out.single = SR(single).slice(0, 400);
const m = await api('POST', '/modules/' + mid + '/records/mass-update', { record_ids: [a.id, b.id], data: [{ field: f('type'), value: enc('Refund') }] }); out.mass = SR(m).slice(0, 600); out.massBody = m.t.slice(0, 600);
out.after = { a: (await recVals(mid, a.id)), b: (await recVals(mid, b.id)) }; out.after = { a: [out.after.a[f('type')], out.after.a[f('order')]], b: [out.after.b[f('type')], out.after.b[f('order')]] };
// mass update on a field that is not a primary field (control)
const m2 = await api('POST', '/modules/' + mid + '/records/mass-update', { record_ids: [a.id, b.id], data: [{ field: f('note'), value: enc('QA mass note') }] }); out.massCtrl = SR(m2).slice(0, 300);
I.massA = a.id; I.massB = b.id; SAVE();
// 2989 conflicts
const t = async (name, acts) => { const r = await mkRule(mid, { layoutId: lid, name: P + ' ' + name, primaryField: f('tier'), status: 'disabled', branches: [br(eq(f('tier'), 'Gold'), acts)] }, 'Leads'); const o = SR(r).slice(0, 400); if (r.j && r.j.data) { await delRule(mid, r.j.data.id); LED('  deleted again ' + r.j.data.id); } return o; };
out.F15 = await t('F15 set+suggest', [{ type: 'set_value', field: f('note'), value: 'a' }, { type: 'recommend_value', field: f('note'), value: 'b' }]);
out.F16 = await t('F16 req+ro', [req([f('note')]), { type: 'read_only_fields', fields: [f('note')] }]);
// 2990 cap
const many = n => Array.from({ length: n }, (_, i) => ({ type: 'show_message', field: null, message: { en: 'QA RT18 m' + i }, tone: 'info' }));
for (const n of [25, 40, 41, 500]) out['cap' + n] = await t('I8 ' + n, many(n));
// 2991 delete via other module
const k = await mkRule(mid, { layoutId: lid, name: P + ' K3', primaryField: f('tier'), status: 'disabled', branches: [br(eq(f('tier'), 'Bronze'), [show([f('reason')])])] }, 'Leads'); I.rK3 = k.j.data.id; SAVE();
out.K3get = (await api('GET', '/modules/' + cm + '/layout-rules/' + I.rK3)).s; out.K3put = (await api('PUT', '/modules/' + cm + '/layout-rules/' + I.rK3, k.j.data)).s;
const d = await api('DELETE', '/modules/' + cm + '/layout-rules/' + I.rK3); out.K3del = SR(d).slice(0, 300); out.K3still = (await getRule(mid, I.rK3)).s;
const d2 = await api('DELETE', '/modules/' + mid + '/layout-rules/00000000-0000-4000-8000-000000000000'); out.delUnknown = SR(d2).slice(0, 200);
return out;
