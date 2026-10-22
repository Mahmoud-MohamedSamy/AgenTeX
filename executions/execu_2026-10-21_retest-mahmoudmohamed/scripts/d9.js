const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', P1 = '640e03a4-9c24-4b06-8d7d-5c1db2711b9b', L = 'fcba0068-d67f-44f5-8412-cdef9c09e16e';
const f = arr((await api('GET', `/modules/${D}/fields`)).j.data).find(x => x.fieldName === 'stage');
const av = f.config.allowed_values.filter(v => v !== 'qa_rt_1295');
const r = await api('PUT', `/modules/${D}/fields/${f.id}`, { ...f, datatypeOptions: { ...f.datatypeOptions, allowed_values: av }, config: { ...f.config, allowed_values: av } });
const f2 = arr((await api('GET', `/modules/${D}/fields`)).j.data).find(x => x.fieldName === 'stage');
const pipes = (await api('GET', `/modules/${D}/pipelines?layout_id=${L}`)).j.data.map(p => p.name + ': ' + p.stages.map(s => s.stageValue).join(','));
const sp = (await api('GET', `/modules/${D}/stage-probability`)).j.data.map(x => x.stageValue);
const add = await api('POST', `/modules/${D}/pipelines/${P1}/stages`, { stageValues: ['qa_rt_1295'] });
return done({ put: r.s + ' ' + (r.s >= 300 ? r.t.slice(0, 300) : ''), stillInField: f2.config.allowed_values.includes('qa_rt_1295'), pipes, spHas: sp.includes('qa_rt_1295'), addDirect: add.s + ' ' + add.t.slice(0, 300) });
