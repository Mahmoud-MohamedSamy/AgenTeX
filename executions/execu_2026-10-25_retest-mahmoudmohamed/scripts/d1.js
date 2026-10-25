const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
const f = arr((await api('GET', `/modules/${D}/fields`)).j?.data).filter(x => x.required || /stage|pipeline/i.test(x.apiName)).map(x => x.apiName + ' ' + x.datatypeKey + ' req=' + x.required + ' opts=' + JSON.stringify(x.datatypeOptions?.options || x.datatypeOptions?.values || x.config?.options || '').slice(0, 300));
const v = arr((await api('GET', `/modules/${D}/views?kind=kanban`)).j?.data?.views).map(x => x.id + ' ' + x.name + ' ' + JSON.stringify(x.settings?.kanban || x.settings?.categorize_by || x.settings).slice(0, 150));
const l = arr((await api('GET', `/modules/${D}/layouts`)).j?.data).map(x => x.id + ' ' + x.name);
return done({ f, v, l });
