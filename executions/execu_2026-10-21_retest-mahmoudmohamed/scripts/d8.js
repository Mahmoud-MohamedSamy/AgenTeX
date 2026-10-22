const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
const f = arr((await api('GET', `/modules/${D}/fields`)).j.data).find(x => x.fieldName === 'stage' || x.apiName === 'stage');
return done({ f: JSON.stringify(f).slice(0, 3000) });
