const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', L = 'fcba0068-d67f-44f5-8412-cdef9c09e16e', P1 = '640e03a4-9c24-4b06-8d7d-5c1db2711b9b', STD = '5170500c-b335-479c-96d1-ed138965c345';
const s = v => ({ kind: 'string', value: v });
const pf = arr((await api('GET', `/modules/${D}/fields`)).j.data).filter(f => /pipeline/i.test(f.fieldName + f.apiName)).map(f => f.fieldName + ':' + f.datatypeKey);
const pv = async id => { const d = (await api('GET', `/modules/${D}/records/${id}`)).j.data; return (d.data.find(x => x.field === 'pipeline') || {}).value?.value === P1 ? '"1"' : 'Standard'; };
const out = { pipelineField: pf };
const tryCreate = async (label, body) => { const r = await api('POST', `/modules/${D}/records`, body); const id = r.j?.data?.id; out[label] = r.s + ' → ' + (id ? await pv(id) : r.t.slice(0, 120)); };
const base = n => [{ field: 'deal_name', value: s('QA RT pipe ' + n) }, { field: 'amount', value: { kind: 'number', value: 1 } }];
await tryCreate('data[] pipeline (UI shape)', { data: [...base('a'), { field: 'pipeline', value: s(P1) }], layout_id: L });
await tryCreate('top-level pipeline_id', { data: base('b'), layout_id: L, pipeline_id: P1 });
await tryCreate('top-level pipelineId', { data: base('c'), layout_id: L, pipelineId: P1 });
await tryCreate('data[] pipeline_id', { data: [...base('d'), { field: 'pipeline_id', value: s(P1) }], layout_id: L });
// move an imported deal (on "1") to Standard
const recs = arr((await api('GET', `/modules/${D}/records?page=1&per_page=200`)).j.data); const imp = recs.find(r => /QA RT 1323 won/.test(JSON.stringify(r.data)));
const m = await api('PATCH', `/modules/${D}/records/${imp.id}`, { data: [{ field: 'pipeline', value: s(STD) }, { field: 'stage', value: s('proposal') }] });
out['PATCH imported deal "1" → Standard'] = m.s + ' → now ' + await pv(imp.id);
return done(out);
