const M = made.mod, LID = made.layouts[0], sid = made.importSession;
const f = await api('GET', `/modules/${M}/import/${sid}/fields?layout_id=${LID}`); const fx = L(f.j?.data).filter(x => x.datatype === 'formula' || /fx/.test(x.field_name)); log('formula fields offered for mapping', fx.map(x => x.field_name + ':' + x.permission));
const bad = await api('PUT', `/modules/${M}/import/${sid}/mapping`, { layout_id: LID, mapping: [{ header: 'Name', field: 'name' }, { header: 'QA Num', field: 'qa_num' }, { header: 'QA FX UI Double', field: 'qa_fx_ui_double' }] }); log('map formula column', E(bad));
const ok = await api('PUT', `/modules/${M}/import/${sid}/mapping`, { layout_id: LID, mapping: [{ header: 'Name', field: 'name' }, { header: 'QA Num', field: 'qa_num' }, { header: 'QA FX UI Double', field: null }] }); log('map ok', E(ok));
const v = await api('POST', `/modules/${M}/import/${sid}/validate`); log('validate', E(v), JSON.stringify(v.j?.data).slice(0, 300));
const x = await api('POST', `/modules/${M}/import/${sid}/execute`); log('execute', E(x));
let st; for (let i = 0; i < 30; i++) { await sleep(4000); st = await api('GET', `/modules/${M}/import/${sid}`); if (/complete|done|failed|finished|succeeded/i.test(st.j?.data?.status || '')) break; } log('status', JSON.stringify(st.j?.data).slice(0, 300));
const recs = L((await api('GET', `/modules/${M}/records?limit=20&sort_by=created_at&sort_dir=desc`)).j?.data).map(r => ({ id: r.id, ...flat(r.data) })).filter(v => /H6/.test(v.name));
for (const r of recs) { made.recs.push(r.id); log(r.name, 'qa_num', r.qa_num, 'ui double', r.qa_fx_ui_double, 'fx_e7', r.fx_e7); } keep(); led((made.appKey || 'crm') + ' import session ' + sid + ' (3 QA FX H6 records)');
