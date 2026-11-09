const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
const cur = (await api('GET', `/modules/${D}/list-preferences`)).j?.data;
const s = (await api('PUT', `/modules/${D}/list-preferences`, { prefs: { lastView: 'list', pageSize: 25, hiddenKeys: [], visibleKeys: [] }, version: cur.version })).s;
const after = (await api('GET', `/modules/${D}/list-preferences`)).j?.data;
return done({ put: s, after });
