// Follow-ups: TU-20 address, TU-22 field check (criteria format), TU-31 required-for, proof of stored invalid values (TU-06/12/18).
const fields = L((await api('GET', `/modules/${T}/fields`)).j?.data);
const fname = f => f.fieldName || f.name; const ftype = f => f.datatypeKey || f.datatype?.key;
const one = async (tg, during) => { const m = await mkBp(DEF(tg, S3(), [TR('go', 'Open', 'Escalated', { during }), TR('end', 'Escalated', 'Closed')])); const t = m.ok ? await mkT(tg) : null; if (t) await waitIn(t); return { m, t }; };
// proof: invalid values stored
const proof = {};
for (const [n, v, k] of [['qa_ndc_tkt_pnr_no', 'y'.repeat(400), 'tooLong'], ['category', 'zzz-not-an-option', 'badOption'], ['contact_id', crypto.randomUUID(), 'missingContact']]) {
  const g = 'PRF' + uid(); const { t } = await one(g, { requiredFields: [{ name: n, required: true, datatype: { key: ftype(fields.find(f => fname(f) === n)) } }] });
  const r = await runT(t, 'go', 'Open', { fields: { [n]: v } }); await sleep(1500); const saved = (await flds(t))[n];
  proof[k] = `${E(r)} → stored ${typeof saved === 'string' ? (saved.length > 40 ? saved.length + ' chars' : saved) : JSON.stringify(saved)}`;
}
const bypass = Object.values(proof).every(x => /^200/.test(x));
R('TU-06', bypass ? 'FAIL' : 'PASS', 'Text longer than the field limit (255) through a transition: ' + proof.tooLong + '; a normal edit refuses it (TEXT_TOO_LONG)');
R('TU-12', bypass ? 'FAIL' : 'PASS', 'Pick list value that is not an option through a transition: ' + proof.badOption + '; a normal edit refuses it (PICKLIST_VALUE_INVALID)');
R('TU-18', bypass ? 'FAIL' : 'PASS', 'Contact id that does not exist through a transition: ' + proof.missingContact + '; a normal edit refuses it (LOOKUP_RECORD_NOT_FOUND). Contact name vs id on screen in Phase 3');
// TU-19 user fields: every user field is system / read-only
const userFields = fields.filter(f => ftype(f) === 'user').map(fname);
R('TU-19', 'N/A', `user-type fields on Desk tickets: ${userFields.join(', ')}; all are system fields and refused as transition items ("set by the system or read-only") — no editable user field to test`);
// TU-20 address: learn the stored shape from a normal edit first
const af = fields.find(f => ftype(f) === 'address'); const an = fname(af);
const probe = await mkT('ADDR' + uid(), 'shape'); const shapes = [{ street: 'QA 1 St', city: 'Cairo', country: 'Egypt', postal_code: '11511' }, { line1: 'QA 1 St', city: 'Cairo', country: 'EG', postalCode: '11511' }];
let good = null, stored0 = null; for (const s of shapes) { const r = await setF(probe, { [an]: s }); stored0 = (await flds(probe))[an]; if (ok(r) && stored0) { good = s; break; } }
if (good) {
  const g = 'TU20' + uid(); const { t } = await one(g, { requiredFields: [{ name: an, required: true, datatype: { key: 'address' } }] });
  const r = await runT(t, 'go', 'Open', { fields: { [an]: good } }); await sleep(1500); const sv = (await flds(t))[an];
  R('TU-20', ok(r) && JSON.stringify(sv || '').includes('Cairo') ? 'PASS' : 'FAIL', `address "${an}": normal edit stores ${JSON.stringify(stored0).slice(0, 100)}; through a transition → ${E(r)}, stored ${JSON.stringify(sv).slice(0, 100)}`);
} else R('TU-20', 'INCONCLUSIVE', `could not learn the address value shape for ${an} through a normal edit`);
// TU-22 field check with the blueprint criteria format
const nf = fields.find(f => fname(f) === 'qa_ndc_number_of_assigned_requests'); const n = fname(nf);
const g22 = 'TU22' + uid();
const rule = { op: 'gt', field: n, value: 10 };
const m22 = await mkBp(DEF(g22, S3(), [TR('go', 'Open', 'Escalated', { during: { requiredFields: [{ name: n, required: true, datatype: { key: ftype(nf) } }], fieldValidations: [{ field: n, rule, message: 'QA BP R must be more than 10' }] } }), TR('end', 'Escalated', 'Closed')]));
const noMsg = await mkBp(DEF(g22 + 'x', S3(), [TR('go', 'Open', 'Escalated', { during: { fieldValidations: [{ field: n, rule, message: '' }] } }), TR('end', 'Escalated', 'Closed')]), false);
if (m22.ok) { const t = await mkT(g22); await waitIn(t); const r5 = await runT(t, 'go', 'Open', { fields: { [n]: 5 } }); const r20 = await runT(t, 'go', 'Open', { fields: { [n]: 20 } });
  R('TU-22', r5.s >= 400 && /more than 10/.test(r5.t) && ok(r20) && !noMsg.ok ? 'PASS' : 'FAIL', `check "${n} > 10": value 5 → ${E(r5)}; 20 → ${E(r20)}; check without a message: ${noMsg.ok ? 'SAVED' : 'refused ' + code(noMsg.r)}`); }
else R('TU-22', 'FAIL', 'field check with {op, field, value} not accepted: ' + E(m22.r));
// TU-31 required for some agents
const g31 = 'TU31' + uid();
for (const rf of [{ comment: { userIds: [U.A], teamIds: [] } }, { comment: [U.A] }, { comment: { users: [U.A] } }]) {
  const m = await mkBp(DEF(g31, S3(), [TR('go', 'Open', 'Escalated', { during: { deskItems: [{ kind: 'comment', mandatory: false }], requiredFor: rf } }), TR('end', 'Escalated', 'Closed')]));
  if (!m.ok) { log('requiredFor shape refused', JSON.stringify(rf), E(m.r)); continue; }
  const sd = (await getBp(m.id)).definition.transitions[0].during;
  const ta = await mkT(g31, 'A'), tb = await mkT(g31, 'B'); await waitIn(ta); await waitIn(tb);
  const rA = await runT(ta, 'go', 'Open', {}, A), rB = await runT(tb, 'go', 'Open', {}, B);
  R('TU-31', rA.s >= 400 && ok(rB) ? 'PASS' : 'FAIL', `stored requiredFor ${JSON.stringify(sd.requiredFor)}; Agent A (required) without comment → ${E(rA)}; Agent B (optional) without → ${E(rB)}`);
  break;
}
return await cleanup();
