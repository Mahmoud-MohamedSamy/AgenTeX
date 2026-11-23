// P0 batch 2 (API): E32 blank sweep, G11 server checks, J2, H7, H15, K1, K3, K4. -> out/b2.json
const M = made.mod, LID = made.layouts[0]; const res = {};
const fields = L((await api('GET', `/modules/${M}/fields`)).j?.data); const byName = Object.fromEntries(fields.map(f => [f.fieldName, f]));
const fx = fields.filter(f => f.datatypeKey === 'formula');
const mkRec = async (tag, vals) => { const r = await api('POST', `/modules/${M}/records`, { layout_id: LID, data: data({ name: 'QA FX ' + tag, ...vals }) }); if (r.j?.data?.id) { made.recs.push(r.j.data.id); keep(); } return r; };
// E32 — blank sweep
{ const r = await mkRec('E32 blank', {}); const v = await getRec(M, r.j.data.id); const bad = [];
  for (const f of fx) { const g = v[f.fieldName]; if (typeof g === 'string' && /null|undefined|NaN|Infinity|\[object/i.test(g)) bad.push(f.fieldName + '=' + g); if (typeof g === 'number' && !isFinite(g)) bad.push(f.fieldName + '=' + g); }
  res.E32 = { verdict: bad.length ? 'FAIL' : 'PASS', formulas: fx.length, bad, sample: Object.fromEntries(fx.slice(0, 60).map(f => [f.fieldName, v[f.fieldName] === undefined ? '(absent)' : v[f.fieldName]])) }; }
// G11 — server repeats checks
{ const bad = { unterminated: 'concat("abc)', badChar: 'qa_num # 2', openParen: '(qa_num + 1', closeParen: 'qa_num + 1)', noLeft: '* 2', endsOp: 'qa_num +', badComma: 'concat(,"a")', ifArity: 'if(qa_num > 1, 1)',
    concat17: 'concat(' + Array(17).fill('"a"').join(', ') + ')', deep33: '('.repeat(33) + 'qa_num' + ')'.repeat(33), tokens513: Array(257).fill('1').join('+'), len2001: 'qa_num + ' + '1'.repeat(1992), subformCol: 'qa_items.qty + 1', subformUnknown: 'sum(qa_items.nope)', empty: '', spaces: '   ', huge: '1+'.repeat(50000) + '1' };
  const out = {}; let saved = 0;
  for (const [k, e] of Object.entries(bad)) {
    const n = 'fx_g11_' + k.toLowerCase(); const r = await api('POST', `/modules/${M}/fields`, { fields: [fdef(n, 'QA FX G11 ' + k, 'formula', { expression: e, return_kind: 'number' })] });
    out[k] = { len: e.length, s: r.s, msg: r.s >= 300 ? E(r).slice(0, 260) : 'SAVED' }; if (r.s < 300) { saved++; made.fx.push(n); keep(); }
  }
  const ok32 = await api('POST', `/modules/${M}/fields`, { fields: [fdef('fx_g11_deep32', 'QA FX G11 deep32', 'formula', { expression: '('.repeat(31) + 'qa_num' + ')'.repeat(31), return_kind: 'number' })] }); out.deep31_control = { s: ok32.s, msg: ok32.s >= 300 ? E(ok32).slice(0, 200) : 'SAVED' }; if (ok32.s < 300) { made.fx.push('fx_g11_deep32'); keep(); }
  res.G11 = { verdict: saved ? 'FAIL' : 'PASS', saved, out }; }
// J2 — API write to a formula is ignored
{ const r = await mkRec('J2', { qa_num: 4, fx_b2: 999 }); const v = r.j?.data?.id ? await getRec(M, r.j.data.id) : {};
  const p = r.j?.data?.id ? await api('PATCH', `/modules/${M}/records/${r.j.data.id}`, { data: data({ fx_b2: 555 }) }) : null; const v2 = r.j?.data?.id ? await getRec(M, r.j.data.id) : {};
  res.J2 = { verdict: v.fx_b2 === 6 && v2.fx_b2 === 6 ? 'PASS' : 'FAIL', create: r.s + (r.s >= 300 ? ' ' + E(r) : ''), afterCreate: v.fx_b2, patch: p && E(p), afterPatch: v2.fx_b2 }; }
// H7 — API update recalculates
{ const r = await mkRec('H7', { qa_num: 4 }); const id = r.j.data.id; const a = (await getRec(M, id)).fx_b2;
  const p = await api('PATCH', `/modules/${M}/records/${id}`, { data: data({ qa_num: 10 }) }); const b = (await getRec(M, id)).fx_b2;
  const p2 = await api('PATCH', `/modules/${M}/records/${id}`, { data: data({ qa_num: null }) }); const c = (await getRec(M, id)).fx_b2;
  res.H7 = { verdict: a === 6 && b === 15 ? 'PASS' : 'FAIL', create: a, patch10: E(p) + ' -> ' + b, patchNull: E(p2) + ' -> ' + c }; }
// H15 — formula added after records exist (probe record qa_num=4 was made before fx_b2)
{ const pr = await mkRec("H15 before", { qa_num: 4 }); const probe = pr.j.data.id; const nf = await api("POST", `/modules/${M}/fields`, { fields: [fdef("fx_h15", "QA FX H15", "formula", { expression: "qa_num * 5", return_kind: "number" })] }); if (nf.s < 300) { made.fx.push("fx_h15"); keep(); } await sleep(20000); const v = await getRec(M, probe);
  res.H15 = { verdict: v.fx_h15 === 20 ? "PASS" : "FAIL", probeRecord: probe, field: E(nf), fx_h15_after20s: v.fx_h15 === undefined ? "(absent)" : v.fx_h15, note: "record saved before the formula field existed" }; }
// K1 — edit expression: existing records recalculated?
{ const r = await mkRec('K1', { qa_num: 4 }); const id = r.j.data.id; const f = byName.fx_e7; const before = (await getRec(M, id)).fx_e7;
  const p = await api('PUT', `/modules/${M}/fields/${f.id}`, { ...f, datatypeOptions: { expression: 'qa_num * 3', return_kind: 'number' } });
  await sleep(20000); const after20 = (await getRec(M, id)).fx_e7;
  const t = await api('PATCH', `/modules/${M}/records/${id}`, { data: data({ qa_text: 'touch' }) }); const afterSave = (await getRec(M, id)).fx_e7;
  const probeVal = "n/a";
  res.K1 = { verdict: after20 === 12 ? 'PASS' : 'FAIL', put: E(p), before, after20s: after20, afterNextSave: afterSave + ' (' + t.s + ')', probe_after_1h: probeVal + ' (expected 12 after edit to *3)' };
  await api('PUT', `/modules/${M}/fields/${f.id}`, { ...f, datatypeOptions: { expression: 'qa_num * 2', return_kind: 'number' } }); }
// K3 / K4 — referenced field removed from layout, then deleted
{ const add = await api('POST', `/modules/${M}/fields`, { fields: [fdef('qa_k4', 'QA K4 input', 'number')] });
  const fk = await api('POST', `/modules/${M}/fields`, { fields: [fdef('fx_k4', 'QA FX K4', 'formula', { expression: 'qa_k4 + 1', return_kind: 'number' })] }); made.fx.push('fx_k4'); keep();
  const r = await mkRec('K4', { qa_k4: 5 }); const id = r.j?.data?.id; const before = id ? (await getRec(M, id)).fx_k4 : undefined;
  const kf = L((await api('GET', `/modules/${M}/fields`)).j?.data).find(f => f.fieldName === 'qa_k4');
  const usage = await api('GET', `/modules/${M}/fields/${kf.id}/usage`);
  const del = await api('DELETE', `/modules/${M}/fields/${kf.id}`);
  const after = L((await api('GET', `/modules/${M}/fields`)).j?.data); const fkAfter = after.find(f => f.fieldName === 'fx_k4'); const inputAfter = after.find(f => f.fieldName === 'qa_k4');
  const open = id ? await api('GET', `/modules/${M}/records/${id}`) : null; const newRec = await mkRec('K4 after delete', { qa_num: 1 });
  res.K4 = { add: add.s, formula: fk.s, before, usage: E(usage) + ' ' + JSON.stringify(usage.j?.data).slice(0, 400), delete: E(del), inputStillThere: !!inputAfter && inputAfter.status, formulaAfter: fkAfter ? fkAfter.datatypeOptions : '(gone)', openRecord: open && open.s, newRecordAfterDelete: E(newRec) };
  res.K4.verdict = del.s >= 400 ? 'PASS (blocked)' : (open && open.s === 200 && newRec.s < 300 ? 'CHECK' : 'FAIL'); }
fs.writeFileSync(RUN + '/out/' + (made.appKey || 'crm') + '-b2.json', JSON.stringify(res, null, 1));
for (const [k, v] of Object.entries(res)) log(k, v.verdict, JSON.stringify(v).slice(0, 1500));
