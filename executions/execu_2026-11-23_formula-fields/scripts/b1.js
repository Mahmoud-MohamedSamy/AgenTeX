// P0 batch 1 (API): create formula fields, then records with inputs, read values, compare. Results -> out/b1.json
const M = made.mod, LID = made.layouts[0], AID = made.acc;
const S = (k, e) => ({ k, e }); // field spec: return kind, expression
// cases: id -> { f: {suffix: spec}, rows: [{ in, exp: {suffix: expected} }], refuse: true }
const C = {
 B2: { f: { '': S('number', 'qa_num * 1.5') }, rows: [{ in: { qa_num: 4 }, exp: { '': 6 } }] },
 B3: { f: { '': S('string', 'concat(qa_text, "-", qa_num)') }, rows: [{ in: { qa_text: 'Ab', qa_num: 7 }, exp: { '': 'Ab-7' } }] },
 B4: { f: { '': S('boolean', 'qa_num > 10') }, rows: [{ in: { qa_num: 11 }, exp: { '': true } }, { in: { qa_num: 9 }, exp: { '': false } }] },
 B5: { f: { '': S('date', 'qa_date') }, rows: [{ in: { qa_date: '2026-11-23' }, exp: { '': '2026-11-23' } }] },
 C1: { f: { '': S('number', '(qa_num + 2) * 3 - 4 / 2') }, rows: [{ in: { qa_num: 4 }, exp: { '': 16 } }] },
 C2: { f: { '': S('number', '2 + 3 * 4') }, rows: [{ in: {}, exp: { '': 14 } }] },
 C7: { f: { eq1: S('boolean', 'qa_num = qa_num2'), eq2: S('boolean', 'qa_num == qa_num2'), ne1: S('boolean', 'qa_num != qa_num2'), ne2: S('boolean', 'qa_num <> qa_num2'), lt: S('boolean', 'qa_num < qa_num2'), gt: S('boolean', 'qa_num > qa_num2'), le: S('boolean', 'qa_num <= qa_num2'), ge: S('boolean', 'qa_num >= qa_num2') },
   rows: [{ in: { qa_num: 5, qa_num2: 5 }, exp: { eq1: true, eq2: true, ne1: false, ne2: false, lt: false, gt: false, le: true, ge: true } }, { in: { qa_num: 5, qa_num2: 6 }, exp: { eq1: false, eq2: false, ne1: true, ne2: true, lt: true, gt: false, le: true, ge: false } }] },
 C9: { f: { and: S('boolean', 'qa_num > 1 && qa_check'), or: S('boolean', 'qa_num > 9 or qa_check') },
   rows: [[10, true, true, true], [10, false, false, true], [0, true, false, true], [0, false, false, false]].map(([n, c, a, o]) => ({ in: { qa_num: n, qa_check: c }, exp: { and: a, or: o } })) },
 C14: { f: { c: S('number', 'qa_num / 0'), f: S('number', 'qa_num / qa_zero') }, rows: [{ in: { qa_num: 5, qa_zero: 0 }, exp: { c: null, f: null } }], note: 'pass = blank (null) or refused, never Infinity/NaN' },
 D1: { f: { '': S('string', 'if(qa_num > 1000, "High value", "Standard")') }, rows: [{ in: { qa_num: 1500 }, exp: { '': 'High value' } }, { in: { qa_num: 10 }, exp: { '': 'Standard' } }] },
 D5: { f: { '': S('string', 'concat(qa_num, "|", qa_date, "|", qa_text)') }, rows: [{ in: { qa_num: 4, qa_date: '2026-11-23' }, exp: { '': '4|2026-11-23|' } }], note: 'date text form recorded; no "null", no "4.0"' },
 D6: { f: { '': S('string', 'coalesce(qa_text2, qa_phone, "no number")') }, rows: [{ in: {}, exp: { '': 'no number' } }, { in: { qa_phone: '0100' }, exp: { '': '0100' } }, { in: { qa_phone: '0100', qa_text2: 'm' }, exp: { '': 'm' } }] },
 D7: { f: { mn: S('number', 'min(qa_num, qa_dec, 3)'), mx: S('number', 'max(qa_num, qa_dec, 3)') }, rows: [{ in: { qa_num: 4, qa_dec: 2.5 }, exp: { mn: 2.5, mx: 4 } }] },
 D9: { f: { '': S('number', 'sum(qa_num, 5)') }, rows: [{ in: { qa_num: 4 }, exp: { '': 9 } }] },
 D16: { f: { r0: S('number', 'round(qa_dec)'), r2: S('number', 'round(qa_dec, 2)') }, rows: [{ in: { qa_dec: 2.5 }, exp: { r0: 3, r2: 2.5 } }, { in: { qa_dec: -2.5 }, exp: { r0: '?', r2: -2.5 } }, { in: { qa_dec: 3.14159 }, exp: { r0: 3, r2: 3.14 } }] },
 D17: { f: { t: S('boolean', 'isblank(qa_text)'), n: S('boolean', 'isblank(qa_num)') }, rows: [{ in: {}, exp: { t: true, n: true } }, { in: { qa_text: 'x', qa_num: 0 }, exp: { t: false, n: false } }, { in: { qa_text: '  ' }, exp: { t: '?', n: true } }] },
 D22: { f: { today: S('date', 'today()'), sub: S('string', 'substring(qa_text, 1, 2)') }, refuse: true },
 E1: { f: { '': S('string', 'concat("[", qa_text, "]")') }, rows: [{ in: { qa_text: 'Abc' }, exp: { '': '[Abc]' } }, { in: {}, exp: { '': '[]' } }] },
 E7: { f: { '': S('number', 'qa_num * 2') }, rows: [{ in: { qa_num: 21 }, exp: { '': 42 } }, { in: {}, exp: { '': '?' } }] },
 E8: { f: { '': S('number', 'qa_dec + 0.1') }, rows: [{ in: { qa_dec: 0.2 }, exp: { '': 0.3 } }] },
 E9: { f: { '': S('number', 'qa_cur * 2') }, rows: [{ in: { qa_cur: 10.5 }, exp: { '': 21 } }] },
 E13: { f: { '': S('string', 'if(qa_check, "Yes", "No")') }, rows: [{ in: { qa_check: true }, exp: { '': 'Yes' } }, { in: { qa_check: false }, exp: { '': 'No' } }, { in: {}, exp: { '': 'No' } }] },
 E14: { f: { s: S('string', 'concat("P:", qa_pick)'), b: S('boolean', 'qa_pick = "Blue"') }, rows: [{ in: { qa_pick: 'Blue' }, exp: { s: 'P:Blue', b: true } }, { in: { qa_pick: 'Red' }, exp: { s: 'P:Red', b: false } }] },
 E18: { f: { t: S('string', 'text(qa_date)'), gt: S('boolean', 'qa_date > qa_date2') }, rows: [{ in: { qa_date: '2027-01-01', qa_date2: '2026-12-31' }, exp: { t: '?', gt: true } }, { in: { qa_date: '2026-01-31', qa_date2: '2026-02-01' }, exp: { t: '?', gt: false } }] },
 E19: { f: { '': S('string', 'text(qa_dt)') }, rows: [{ in: { qa_dt: '2026-11-23T21:30:00Z' }, exp: { '': '?' } }], note: '21:30Z = 23:30 Cairo, 23 Nov' },
 E20: { f: { '': S('string', 'concat(qa_account)') }, rows: [{ in: { qa_account: AID }, exp: { '': 'QA FX Acc' } }] },
 E28: { f: { a: S('number', 'qa_num * 2'), b: S('number', 'fx_e28_a + 1') }, rows: [{ in: { qa_num: 4 }, exp: { a: 8, b: 9 } }] },
 F1: { f: { '': S('number', 'sum(qa_items.price)') }, rows: [{ in: { qa_items: [{ price: 10 }, { price: 20 }, { price: 30.5 }] }, exp: { '': 60.5 } }] },
 F2: { f: { avg: S('number', 'avg(qa_items.qty)'), mn: S('number', 'min(qa_items.qty)'), mx: S('number', 'max(qa_items.qty)') }, rows: [{ in: { qa_items: [{ qty: 1 }, { qty: 2 }, { qty: 6 }] }, exp: { avg: 3, mn: 1, mx: 6 } }] },
 F3: { f: { rows: S('number', 'count(qa_items)'), col: S('number', 'count(qa_items.note)') }, rows: [{ in: { qa_items: [{ qty: 1, note: 'a' }, { qty: 2 }, { qty: 3, note: 'c' }] }, exp: { rows: 3, col: 2 } }] },
 G6: { f: { '': S('number', 'fx_g6 + 1') }, refuse: true },
 G7: { f: { '': S('number', 'qa_nope * 2') }, refuse: true },
};
const fname = (id, suf) => ('fx_' + id + (suf ? '_' + suf : '')).toLowerCase();
const res = {}; const have = new Set(L((await api('GET', `/modules/${M}/fields`)).j?.data).map(f => f.fieldName));
for (const [id, c] of Object.entries(C)) {
  res[id] = { fields: {}, rows: [], note: c.note || '' };
  for (const [suf, s] of Object.entries(c.f)) {
    const n = fname(id, suf); if (have.has(n)) { res[id].fields[suf] = { name: n, s: 'exists' }; continue; }
    const r = await api('POST', `/modules/${M}/fields`, { fields: [fdef(n, 'QA FX ' + id + (suf ? ' ' + suf : ''), 'formula', { expression: s.e, return_kind: s.k })] });
    res[id].fields[suf] = { name: n, expr: s.e, kind: s.k, s: r.s, err: r.s >= 300 ? E(r) : '' };
    if (r.s < 300) { (made.fx ||= []).push(n); keep(); }
  }
}
led('CRM QA FX: batch 1 formula fields created: ' + (made.fx || []).length);
for (const [id, c] of Object.entries(C)) {
  if (c.refuse) { res[id].verdict = Object.values(res[id].fields).every(f => f.s >= 400 && f.s < 500) ? 'PASS' : 'FAIL'; continue; }
  let ok = true;
  for (const [i, row] of c.rows.entries()) {
    const r = await api('POST', `/modules/${M}/records`, { layout_id: LID, data: data({ name: 'QA FX ' + id + ' r' + i, ...row.in }) });
    if (r.j?.data?.id) { made.recs.push(r.j.data.id); keep(); }
    const v = r.j?.data?.id ? await getRec(M, r.j.data.id) : {};
    const got = {}, cmp = {};
    for (const [suf, exp] of Object.entries(row.exp)) {
      const g = v[fname(id, suf)]; got[suf] = g === undefined ? '(absent)' : g;
      cmp[suf] = exp === '?' ? 'REC' : (typeof exp === 'number' && typeof g === 'number') ? Math.abs(g - exp) < 1e-9 : (exp === null ? (g === null || g === undefined) : g === exp);
      if (cmp[suf] === false) ok = false;
    }
    res[id].rows.push({ in: row.in, rec: r.s, recErr: r.s >= 300 ? E(r) : '', exp: row.exp, got, cmp, id: r.j?.data?.id });
    if (r.s >= 300) ok = false;
  }
  if (Object.values(res[id].fields).some(f => f.s !== 201 && f.s !== 'exists')) ok = false;
  res[id].verdict = ok ? 'PASS' : 'FAIL';
}
fs.writeFileSync(RUN + '/out/' + (made.appKey || 'crm') + '-b1.json', JSON.stringify(res, null, 1));
for (const [id, r] of Object.entries(res)) log(id, r.verdict, Object.entries(r.fields).map(([s, f]) => (s || '-') + ':' + f.s + (f.err ? ' ' + f.err.slice(0, 160) : '')).join(' ; '), '|', r.rows.map(x => JSON.stringify(x.got) + (x.recErr ? ' REC ' + x.recErr.slice(0, 200) : '')).join(' '));
