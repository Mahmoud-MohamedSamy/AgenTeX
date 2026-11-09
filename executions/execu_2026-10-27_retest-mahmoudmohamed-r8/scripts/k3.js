const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
const f = arr((await api('GET', `/modules/${D}/fields`)).j?.data).find(x => x.apiName === 'pipeline');
const st = arr((await api('GET', `/modules/${D}/fields`)).j?.data).find(x => x.apiName === 'stage');
return done({ field: JSON.stringify(f).slice(0, 1500), stageOpts: JSON.stringify(st?.datatypeOptions || {}).slice(0, 400) });
