const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', R = '8e8227b2-a494-47e3-a368-4e2880e49c39', P1 = '640e03a4-9c24-4b06-8d7d-5c1db2711b9b', LT = '7d1b1a96-a590-45d7-9551-64b1cb7e41d1';
const s = v => ({ kind: 'string', value: v });
const pt = await api('PATCH', `/modules/${D}/records/${R}`, { data: [{ field: 'pipeline', value: s(P1) }, { field: 'stage', value: s('test-02') }] });
const pt2 = await api('PATCH', `/modules/${D}/records/${R}`, { data: [{ field: 'stage', value: s('test-02') }] });
const recs = await api('GET', `/modules/${D}/records?page=1&per_page=200`);
const all = arr(recs.j.data || recs.j); const byPipe = {}; for (const r of all) { const p = ((r.data||[]).find(x => x.field === 'pipeline') || {}).value?.value || 'none'; byPipe[p] = (byPipe[p] || 0) + 1; }
const lt = await api('GET', `/modules/${D}/pipelines?layout_id=${LT}`);
return done({ pt: pt.s + ' ' + pt.t.slice(0, 500), pt2: pt2.s + ' ' + pt2.t.slice(0, 500), total: all.length, meta: recs.j.meta, byPipe, testLayoutPipes: (lt.j.data||[]).map(p => p.id + ' ' + p.name + ' def=' + p.isDefault + ' ' + p.stages.map(x=>x.stageValue).join(',')) });
