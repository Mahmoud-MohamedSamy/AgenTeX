const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', P1 = '640e03a4-9c24-4b06-8d7d-5c1db2711b9b';
const a = await api('POST', `/modules/${D}/pipelines/${P1}/stages`, { stageValue: 'qa_rt_1295' });
const pipes = (await api('GET', `/modules/${D}/pipelines?layout_id=fcba0068-d67f-44f5-8412-cdef9c09e16e`)).j.data.find(p => p.id === P1).stages.map(s => s.stageValue);
return done({ a: a.s + ' ' + a.t.slice(0, 400), pipes });
