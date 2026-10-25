const M = { Tasks: 'a9d87b62-b704-4c2e-b2d5-1b745d7c2065', Deals: 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', Contacts: '6f553963-01d6-4b68-9fb3-143d23044c41' };
const out = {};
for (const [k, id] of Object.entries(M)) out[k] = (await api('GET', `/modules/${id}/records?page=1&per_page=1`)).j?.meta?.total_count;
const mods = arr((await api('GET', '/modules')).j?.data); for (const m of mods.slice(0, 40)) { const c = (await api('GET', `/modules/${m.id}/records?page=1&per_page=1`)).j?.meta?.total_count; if (c >= 100) out[m.name || m.moduleKey || m.id] = c + ' ' + m.id; }
return done(out);
