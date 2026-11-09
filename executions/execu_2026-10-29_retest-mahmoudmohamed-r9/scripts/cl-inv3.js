const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
const r = await api('GET', `/modules/${D}/views?kind=kanban`); const r2 = await api('GET', `/modules/${D}/views?kind=list`);
return done({ kanban: r.t.slice(0, 500), listHasQA: r2.t.includes('QA RT') });
