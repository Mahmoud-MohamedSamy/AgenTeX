const M = { leads:'841043e1-c078-41f9-8d6e-dfd61bee45c3', deals:'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', contacts:'6f553963-01d6-4b68-9fb3-143d23044c41' };
const out = {};
for (const [k, id] of Object.entries(M)) { const r = await api('GET', `/modules/${id}/records?page=1&page_size=5`); out[k] = { s: r.s, n: arr(r.j?.data).length, total: r.j?.meta?.total ?? r.j?.data?.total, err: r.s>=300 ? (r.t||'').slice(0,160) : undefined }; }
const m = await api('GET', '/modules?page=1&page_size=200'); out.modules = arr(m.j?.data).map(x => x.moduleKey + (x.accessible === false ? '(no)' : '')).join(' ');
return out;
