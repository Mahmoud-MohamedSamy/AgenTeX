// P1 batch 10 (API): H5 mass update, I6 export, I13 rule pickers, K2 rename, K5 delete formula, Z3/Z4/Z5 functions, X2 journey.
const M = made.mod, LID = made.layouts[0]; const res = {};
const mkRec = async (tag, vals) => { const r = await api('POST', `/modules/${M}/records`, { layout_id: LID, data: data({ name: 'QA FX ' + tag, ...vals }) }); if (r.j?.data?.id) { made.recs.push(r.j.data.id); keep(); } return r; };
const fl = async () => L((await api('GET', `/modules/${M}/fields`)).j?.data);
// H5 mass update
{ const ids = []; for (const n of [1, 2, 3]) ids.push((await mkRec('H5 ' + n, { qa_num: n })).j.data.id);
  const j = await api('POST', `/modules/${M}/records/mass-update-jobs`, { record_ids: ids, data: data({ qa_num: 3 }) }); let vals = [];
  for (let i = 0; i < 15; i++) { await sleep(3000); vals = []; for (const id of ids) { const v = await getRec(M, id); vals.push([v.qa_num, v.fx_e7]); } if (vals.every(x => x[0] === 3)) break; }
  res.H5 = { job: E(j), values: vals, verdict: vals.every(x => x[0] === 3 && x[1] === 6) ? 'PASS' : (vals.every(x => x[0] === 3) ? 'FAIL (formula not recalculated by mass update)' : 'BLOCKED (job did not apply)') }; }
// I6 export
{ const tries = ['', '?format=csv', '?format=csv&fields=name,qa_num,fx_e7,fx_l1']; res.I6 = {};
  for (const q of tries) { const r = await api('GET', `/modules/${M}/records/export${q}`); const t = r.t || ''; res.I6[q || 'none'] = { s: r.s, hasFormulaHeader: /fx_e7|QA FX E7/i.test(t), l1Line: (t.split('\n').find(l => /onerror/.test(l)) || '').slice(0, 160), head: t.slice(0, 200) }; if (r.s === 200) break; } }
// I13 layout rule / validation rule on a formula
{ const lr = await api('POST', `/modules/${M}/layout-rules`, { name: 'QA FX I13 LR', triggerField: 'fx_e7', layoutId: LID, conditions: [{ field: 'fx_e7', operator: 'equals', value: '10' }], actions: [{ type: 'show', targetField: 'qa_text' }] });
  const vr = await api('POST', `/modules/${M}/validation-rules`, { name: 'QA FX I13 VR', condition: { op: 'gt', field: 'fx_e7', value: 100 }, errorMessage: { en: 'too big' } });
  for (const [k, r] of [['lr', lr], ['vr', vr]]) if (r.j?.data?.id) { (made.rules ||= []).push(k + ':' + r.j.data.id); keep(); led('CRM ' + k + ' ' + r.j.data.id); }
  let vrApplied = null; if (vr.s < 300) { const t = await mkRec('I13 vr', { qa_num: 60 }); vrApplied = E(t); }
  res.I13 = { layoutRuleOnFormula: E(lr), validationRuleOnFormula: E(vr), recordWith120: vrApplied, verdict: lr.s >= 400 && vr.s >= 400 ? 'PASS (both refused)' : 'CHECK' }; }
// K2 rename the label of a referenced field
{ const n = (await fl()).find(f => f.fieldName === 'qa_num'); const p = await api('PATCH', `/modules/${M}/fields/${n.id}/labels`, { labels: { en: 'QA Num renamed' } }); const r = await mkRec('K2', { qa_num: 5 }); const v = flat(r.j?.data?.data);
  await api('PATCH', `/modules/${M}/fields/${n.id}/labels`, { labels: { en: 'QA Num' } }); res.K2 = { rename: E(p), fx_e7: v.fx_e7, verdict: v.fx_e7 === 10 ? 'PASS' : 'FAIL' }; }
// K5 delete a formula field used in a filter/sort
{ const a = await api('POST', `/modules/${M}/fields`, { fields: [fdef('fx_k5', 'QA FX K5', 'formula', { expression: 'qa_num + 100', return_kind: 'number' })] }); const f = (await fl()).find(x => x.fieldName === 'fx_k5');
  const u = await api('GET', `/modules/${M}/fields/${f.id}/usage`); const d = await api('DELETE', `/modules/${M}/fields/${f.id}`);
  const s = await api('GET', `/modules/${M}/records?limit=5&sort_by=fx_k5&sort_dir=asc`); const q = await api('GET', `/modules/${M}/records?limit=5&filters=` + encodeURIComponent(JSON.stringify([{ field: 'fx_k5', operator: 'greater_than', value: 1 }])));
  const r = await mkRec('K5 after', { qa_num: 1 }); res.K5 = { create: E(a), usage: E(u), delete: E(d), sortByDeleted: E(s).slice(0, 160), filterByDeleted: E(q).slice(0, 160), recordAfter: E(r), verdict: d.s === 204 && r.s === 201 ? 'PASS' : 'CHECK' }; }
// Z3/Z4/Z5 — functions Zoho has
{ const fns = ['find(qa_text, "a")', 'contains(qa_text, "a")', 'startswith(qa_text, "a")', 'endswith(qa_text, "a")', 'substring(qa_text, 1, 2)', 'replace(qa_text, "a", "b")', 'tostring(qa_num)', 'ceil(qa_dec)', 'floor(qa_dec)', 'sqrt(qa_num)', 'mod(qa_num, 3)', 'naturallog(qa_num)', 'base10log(qa_num)', 'and(true, false)', 'or(true, false)', 'case(qa_num, 1, "a", "b")', 'now()', 'today()', 'adddate(qa_date, 1, "DAY")', 'datecomp(qa_date, qa_date2)', 'year(qa_date)'];
  res.Z = {}; for (const [i, e] of fns.entries()) { const r = await api('POST', `/modules/${M}/fields`, { fields: [fdef('fx_z_' + i, 'QA FX Z ' + i, 'formula', { expression: e, return_kind: 'string' })] }); res.Z[e] = r.s === 201 ? 'ACCEPTED' : 'refused'; if (r.s === 201) { made.fx.push('fx_z_' + i); keep(); } } }
// X2 customer label journey
{ const a = await api('POST', `/modules/${M}/fields`, { fields: [fdef('fx_x2_label', 'QA FX X2 Label', 'formula', { expression: 'upper(trim(concat(qa_text2, ", ", qa_text)))', return_kind: 'string' }), fdef('fx_x2_tag', 'QA FX X2 Tag', 'formula', { expression: 'if(isblank(qa_phone), "No phone", if(qa_num > 1000, "VIP", "Standard"))', return_kind: 'string' })] }); if (a.s < 300) { made.fx.push('fx_x2_label', 'fx_x2_tag'); keep(); }
  const out = []; for (const [t, ph, n] of [[' ahmed ', '', 5], ['sara', '0100', 1500], ['omar', '0100', 10]]) { const v = flat((await mkRec('X2 ' + t.trim(), { qa_text: t, qa_text2: 'Ali', qa_phone: ph || null, qa_num: n })).j?.data?.data); out.push([v.fx_x2_label, v.fx_x2_tag]); }
  const q = await api('GET', `/modules/${M}/records?limit=50&filters=` + encodeURIComponent(JSON.stringify([{ field: 'fx_x2_tag', operator: 'equals', value: 'VIP' }])));
  res.X2 = { create: E(a), values: out, vipFilter: L(q.j?.data).map(x => flat(x.data).name), verdict: JSON.stringify(out) === JSON.stringify([['ALI, AHMED', 'No phone'], ['ALI, SARA', 'VIP'], ['ALI, OMAR', 'Standard']]) ? 'PASS' : 'CHECK' }; }
fs.writeFileSync(RUN + '/out/' + (made.appKey || 'crm') + '-b10.json', JSON.stringify(res, null, 1));
for (const [k, v] of Object.entries(res)) log(k, JSON.stringify(v).slice(0, 900));
