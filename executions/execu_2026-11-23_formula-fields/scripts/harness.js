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
