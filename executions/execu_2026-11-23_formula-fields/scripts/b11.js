// Batch 11 (API) — remaining P1/P2 value cases. '?' = record.
const OUT = 'b11'; const M = made.mod, LID = made.layouts[0];
const S = (k, e) => ({ k, e });
{ const have0 = L((await api('GET', `/modules/${M}/fields`)).j?.data).map(f => f.fieldName);
  const add = [fdef('qa_address', 'QA Address', 'address'), fdef('qa_file', 'QA File', 'file_upload'), fdef('qa_loc', 'QA Location', 'location'), fdef('qa_tpl', 'QA Template', 'email_template'), fdef('qa_disc', 'QA Disc', 'number'), fdef('qa_tax', 'QA Tax', 'number')];
  for (const f of add) if (!have0.includes(f.fieldName)) log(f.fieldName, E(await api('POST', `/modules/${M}/fields`, { fields: [f] }))); }
const C = {
 C6: { f: { '': S('string', 'qa_text + "x"') }, rows: [{ in: { qa_text: 'A' }, exp: { '': '?' } }] },
 C8: { f: { '': S('boolean', 'qa_text = "abc"') }, rows: [{ in: { qa_text: 'ABC' }, exp: { '': '?' } }, { in: { qa_text: 'abc' }, exp: { '': true } }] },
 C13: { f: { '': S('number', '((((qa_num)))) + ((1))') }, rows: [{ in: { qa_num: 4 }, exp: { '': 5 } }] },
 C15: { f: { '': S('number', 'qa_num\n\t* 2\n\t+ 1') }, rows: [{ in: { qa_num: 4 }, exp: { '': 9 } }] },
 C16: { f: { up: S('number', 'QA_NUM * 2'), fn: S('number', 'ROUND(qa_dec, 0)'), iff: S('string', 'If(qa_num > 1, "y", "n")') }, rows: [{ in: { qa_num: 4, qa_dec: 2.4 }, exp: { up: '?', fn: '?', iff: '?' } }] },
 E11: { f: { '': S('number', 'qa_long + 1') }, rows: [{ in: { qa_long: 9007199254740991 }, exp: { '': '?' } }, { in: { qa_long: 123456789012 }, exp: { '': 123456789013 } }] },
 E24: { f: { '': S('string', 'concat(qa_address)') }, rows: [{ in: { qa_address: { street: '1 Nile St', city: 'Cairo', country: 'Egypt' } }, exp: { '': '?' } }] },
 E25: { f: { '': S('string', 'concat(qa_file)') }, rows: [{ in: {}, exp: { '': '?' } }] },
 E26: { f: { '': S('string', 'concat(qa_loc)') }, rows: [{ in: { qa_loc: { lat: 30.04, lng: 31.23 } }, exp: { '': '?' } }] },
 E27: { f: { '': S('string', 'concat(qa_tpl)') }, rows: [{ in: {}, exp: { '': '?' } }] },
 F4: { f: { sum: S('number', 'sum(qa_items.price)'), cnt: S('number', 'count(qa_items)'), avg: S('number', 'avg(qa_items.qty)'), mn: S('number', 'min(qa_items.qty)') }, rows: [{ in: {}, exp: { sum: 0, cnt: 0, avg: '?', mn: '?' } }, { in: { qa_items: [] }, exp: { sum: 0, cnt: 0, avg: '?', mn: '?' } }] },
 F5: { f: { '': S('number', 'sum(qa_items.price) - qa_disc + qa_tax') }, rows: [{ in: { qa_items: [{ price: 10 }, { price: 50 }], qa_disc: 5, qa_tax: 2 }, exp: { '': 57 } }] },
 L6: { f: { '': S('string', 'concat(' + Array(16).fill('upper(trim(concat(qa_text, "' + 'x'.repeat(60) + '")))').join(', ') + ')') }, rows: [{ in: { qa_text: 'a' }, exp: { '': '?' } }], note: 'long nested expression ~1,900 chars' },
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
led('CRM QA FX: ' + OUT + ' formula fields created: ' + (made.fx || []).length);
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
fs.writeFileSync(RUN + '/out/' + (made.appKey || 'crm') + '-' + OUT + '.json', JSON.stringify(res, null, 1));
for (const [id, r] of Object.entries(res)) log(id, r.verdict, Object.entries(r.fields).map(([s, f]) => (s || '-') + ':' + f.s + (f.err ? ' ' + f.err.slice(0, 160) : '')).join(' ; '), '|', r.rows.map(x => JSON.stringify(x.got) + (x.recErr ? ' REC ' + x.recErr.slice(0, 200) : '')).join(' '));
