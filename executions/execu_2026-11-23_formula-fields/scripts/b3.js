// P0 batch 3 (API): F12 subform rows -> parent; H8 workflow field update -> formula; I7 workflow criteria on a formula. -> out/b3.json
const M = made.mod, LID = made.layouts[0]; const res = {};
const mkRec = async (tag, vals) => { const r = await api('POST', `/modules/${M}/records`, { layout_id: LID, data: data({ name: 'QA FX ' + tag, ...vals }) }); if (r.j?.data?.id) { made.recs.push(r.j.data.id); keep(); } return r; };
// F12
{ const r = await mkRec('F12', { qa_items: [{ qty: 1, price: 10, note: 'a' }, { qty: 2, price: 20 }] }); const id = r.j.data.id; const a = await getRec(M, id);
  const p1 = await api('PATCH', `/modules/${M}/records/${id}`, { data: data({ qa_items: [{ qty: 1, price: 10, note: 'a' }, { qty: 2, price: 20 }, { qty: 6, price: 30.5, note: 'c' }] }) }); const b = await getRec(M, id);
  const p2 = await api('PATCH', `/modules/${M}/records/${id}`, { data: data({ qa_items: [{ qty: 6, price: 30.5, note: 'c' }] }) }); const c = await getRec(M, id);
  const pick = v => ({ sum: v.fx_f1, count: v.fx_f3_rows, notes: v.fx_f3_col, avg: v.fx_f2_avg });
  res.F12 = { two: pick(a), addRow: E(p1) + ' ' + JSON.stringify(pick(b)), removeRows: E(p2) + ' ' + JSON.stringify(pick(c)) };
  res.F12.verdict = a.fx_f1 === 30 && a.fx_f3_rows === 2 && b.fx_f1 === 60.5 && b.fx_f3_rows === 3 && c.fx_f1 === 30.5 && c.fx_f3_rows === 1 ? 'PASS' : 'FAIL'; }
// workflow rules
const T = kind => ({ kind, fieldName: null, fieldNames: null, fieldMatch: null, dateFieldName: null, offsetSeconds: null, offsetMode: null });
const guard = p => ({ kind: 'StringMatch', field: 'name', operator: 'StartsWith', stringValue: p, caseInsensitive: false });
const rule = (name, trig, crit, fu) => ({ moduleId: M, appKey: made.appKey || 'crm', layoutId: null, departmentIds: [], name, description: 'QA FX run 23 Nov - delete', mode: 'Recurring', isActive: true, trigger: T(trig), criteria: crit,
  actions: [{ type: 'FieldUpdate', order: 0, delaySeconds: 0, fieldUpdates: fu }] });
const r1 = await api('POST', '/workflow/rules', rule('QA FX H8 set num', 'RecordCreated', guard('QA FX H8'), { qa_num: { kind: 'int', intValue: 7 } }));
const r2 = await api('POST', '/workflow/rules', rule('QA FX I7 formula gt 10', 'RecordCreatedOrUpdated', { kind: 'Logical', operator: 'And', operands: [guard('QA FX I7'), { kind: 'Comparison', field: 'fx_e7', operator: 'GreaterThan', value: { kind: 'int', intValue: 10 } }] }, { qa_text2: { kind: 'string', stringValue: 'big' } }));
for (const r of [r1, r2]) if (r.j?.data?.id) { (made.wf ||= []).push(r.j.data.id); keep(); led((made.appKey || 'crm') + ' workflow rule ' + r.j.data.id); }
res.rules = { h8: E(r1), i7: E(r2) };
if (r1.s < 300) { const r = await mkRec('H8 wf', { qa_num: 1 }); let v; for (let i = 0; i < 10; i++) { await sleep(3000); v = await getRec(M, r.j.data.id); if (v.qa_num === 7) break; }
  res.H8 = { qa_num: v.qa_num, fx_e7: v.fx_e7, fx_ui: v.qa_fx_ui_double, verdict: v.qa_num === 7 && v.fx_e7 === 14 ? 'PASS' : (v.qa_num === 7 ? 'FAIL (formula not recalculated after workflow update)' : 'BLOCKED (rule did not run)') }; }
if (r2.s < 300) { const a = await mkRec('I7 a', { qa_num: 6 }), b = await mkRec('I7 b', { qa_num: 2 }); await sleep(15000);
  const va = await getRec(M, a.j.data.id), vb = await getRec(M, b.j.data.id);
  const p = await api('PATCH', `/modules/${M}/records/${b.j.data.id}`, { data: data({ qa_num: 8 }) }); await sleep(15000); const vb2 = await getRec(M, b.j.data.id);
  res.I7 = { a: { fx: va.fx_e7, text2: va.qa_text2 }, b: { fx: vb.fx_e7, text2: vb.qa_text2 }, bAfterEditTo8: { fx: vb2.fx_e7, text2: vb2.qa_text2, patch: E(p) } };
  res.I7.verdict = va.qa_text2 === 'big' && !vb.qa_text2 && vb2.qa_text2 === 'big' ? 'PASS' : 'FAIL'; }
fs.writeFileSync(RUN + '/out/' + (made.appKey || 'crm') + '-b3.json', JSON.stringify(res, null, 1));
for (const [k, v] of Object.entries(res)) log(k, JSON.stringify(v).slice(0, 900));
