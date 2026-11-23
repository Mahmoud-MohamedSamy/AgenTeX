const M = made.mod, LID = made.layouts[0];
const r = await api('POST', `/modules/${M}/fields`, { fields: [fdef('fx_probe', 'QA FX probe', 'formula', { expression: 'qa_num * 2', return_kind: 'number' })] });
log('create', E(r), JSON.stringify(r.j?.data).slice(0, 600));
const f = L((await api('GET', `/modules/${M}/fields`)).j?.data).find(x => x.fieldName === 'fx_probe'); log('field', JSON.stringify(f).slice(0, 700));
const rec = await api('POST', `/modules/${M}/records`, { layout_id: LID, data: data({ name: 'QA FX probe', qa_num: 4 }) }); log('rec', E(rec)); const id = rec.j?.data?.id;
if (id) { (made.recs ||= []).push(id); keep(); log('value', (await getRec(M, id)).fx_probe, JSON.stringify(rec.j.data).slice(0, 500)); }
const p = await api('PATCH', `/modules/${M}/fields/${f.id}`, { datatypeOptions: { expression: 'qa_num * 3', return_kind: 'number' } }); log('patch', E(p));
const p2 = await api('PUT', `/modules/${M}/fields/${f.id}`, { ...f, datatypeOptions: { expression: 'qa_num * 3', return_kind: 'number' } }); log('put', E(p2));
const f2 = L((await api('GET', `/modules/${M}/fields`)).j?.data).find(x => x.fieldName === 'fx_probe'); log('opts after', JSON.stringify(f2.datatypeOptions));
if (id) { log('value after edit (no save)', (await getRec(M, id)).fx_probe); }
