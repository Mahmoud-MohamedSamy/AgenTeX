// P2 batch 15 (API): K11 concurrent layout saves, M3 labels AR/FR, N3 import 1000 rows, A12 quick-create placement.
const M = made.mod, LID = made.layouts[0]; const res = {};
// K11: two saves of the same layout version
{ const lay = (await api('GET', `/modules/${M}/layouts/${LID}`)).j.data; const body = { name: lay.name, views: lay.views, assignedProfiles: lay.assignedProfiles, status: lay.status, accessMode: lay.accessMode, rowVersion: lay.rowVersion, description: lay.description };
  const a = await api('PUT', `/modules/${M}/layouts/${LID}`, body); const b = await api('PUT', `/modules/${M}/layouts/${LID}`, body);
  const f = L((await api('GET', `/modules/${M}/fields`)).j?.data).find(x => x.fieldName === 'fx_e7');
  const p1 = await api('PUT', `/modules/${M}/fields/${f.id}`, { ...f, datatypeOptions: { expression: 'qa_num * 2', return_kind: 'number' } }); const p2 = await api('PUT', `/modules/${M}/fields/${f.id}`, { ...f, datatypeOptions: { expression: 'qa_num * 2', return_kind: 'number' } });
  res.K11 = { layoutFirst: E(a).slice(0, 120), layoutSecondSameVersion: E(b).slice(0, 200), fieldFirst: E(p1), fieldSecondSameRowVersion: E(p2).slice(0, 200), verdict: b.s === 409 || b.s === 412 ? 'PASS (conflict)' : 'CHECK' }; }
// M3: labels in 3 languages
{ const a = await api('POST', `/modules/${M}/fields`, { fields: [{ ...fdef('fx_m3', 'QA FX M3', 'formula', { expression: 'qa_num + 3', return_kind: 'number' }), labels: { en: 'QA FX M3 total', ar: 'الإجمالي QA', fr: 'Total QA FX' } }] }); if (a.s < 300) { made.fx.push('fx_m3'); keep(); }
  const f = L((await api('GET', `/modules/${M}/fields`)).j?.data).find(x => x.fieldName === 'fx_m3'); res.M3 = { create: E(a), labels: f?.labels }; }
if (made.appKey !== 'desk') // N3: import 1,000 rows
{ let csv = 'Name,QA Num\n'; for (let i = 1; i <= 1000; i++) csv += `QA FX N3 ${i},${i}\n`;
  const fd = new FormData(); fd.append('file', new Blob([csv], { type: 'text/csv' }), 'qa-fx-n3.csv'); const t0 = Date.now();
  const up = await api('POST', `/modules/${M}/import`, fd, { form: true }); const sid = up.j?.data?.session_id; res.N3 = { upload: E(up) };
  if (sid) { (made.imports ||= []).push(sid); keep(); led((made.appKey || 'crm') + ' import N3 ' + sid + ' (1000 rows)');
    await api('PUT', `/modules/${M}/import/${sid}/mapping`, { layout_id: LID, mapping: [{ header: 'Name', field: 'name' }, { header: 'QA Num', field: 'qa_num' }] }); const v = await api('POST', `/modules/${M}/import/${sid}/validate`); const x = await api('POST', `/modules/${M}/import/${sid}/execute`);
    let st; for (let i = 0; i < 60; i++) { await sleep(5000); st = await api('GET', `/modules/${M}/import/${sid}`); if (/completed|failed/.test(st.j?.data?.status || '')) break; }
    const secs = Math.round((Date.now() - t0) / 1000); let bad = 0, checked = 0;
    for (let p = 1; p <= 12; p++) { const r = await api('GET', `/modules/${M}/records?limit=100&page=${p}`); for (const v2 of L(r.j?.data).map(z => flat(z.data))) { const m = /^QA FX N3 (\d+)$/.exec(v2.name || ''); if (m) { checked++; if (v2.fx_e7 !== Number(m[1]) * 2) bad++; } } if (!r.j?.meta?.more_records) break; }
    res.N3 = { ...res.N3, validate: E(v), execute: E(x), status: st.j?.data?.status, created: st.j?.data?.created_count, seconds: secs, checked, wrongFormula: bad, verdict: checked === 1000 && bad === 0 ? 'PASS' : 'CHECK' }; } }
// A12: formula placed on Quick Create by the builder?
{ const lay = (await api('GET', `/modules/${M}/layouts/${LID}`)).j.data; res.A12 = { quickCreateFields: lay.views.QUICK_CREATE.layout.sections.flatMap(s => s.columns.flatMap(c => c.fields.map(f => f.fieldName + ':' + f.datatypeKey))) }; }
fs.writeFileSync(RUN + '/out/' + (made.appKey || 'crm') + '-b15.json', JSON.stringify(res, null, 1));
for (const [k, v] of Object.entries(res)) log(k, JSON.stringify(v).slice(0, 600));
