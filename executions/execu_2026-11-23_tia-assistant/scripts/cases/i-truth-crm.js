const M = { leads:'841043e1-c078-41f9-8d6e-dfd61bee45c3', contacts:'6f553963-01d6-4b68-9fb3-143d23044c41', deals:'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', accounts:'b2398920-2914-4836-be53-81bd960effea' };
const out = {};
for (const [k, id] of Object.entries(M)) { const r = await api('GET', `/modules/${id}/records?page=1&page_size=100`); const rows = arr(r.j?.data).map(x => { const o = {}; for (const f of (x.data || [])) o[f.field] = f.value?.value ?? f.value; return o; }); out[k] = { s: r.s, total: r.j?.meta?.total_count, qa: rows.filter(o => /^QA TIA/.test(o.name || o.deal_name || (o.first_name||'') + ' ' + (o.last_name||''))).map(o => (o.name || o.deal_name || o.first_name + ' ' + o.last_name) + ':' + (o.lead_source || o.stage || '') + ':' + (o.amount ?? '')) }; }
const mods = arr((await api('GET', '/modules?page=1&page_size=200')).j?.data).map(m => (m.labels?.en || m.pluralForm?.en || m.moduleKey) + '(' + m.moduleKey + ')').join(', ');
const rep = await api('GET', '/reports?page=1&page_size=50'); const rep2 = await api('GET', '/analytics/reports?limit=50');
return { out, mods, reports: rep.s + ':' + arr(rep.j?.data).length, reports2: rep2.s + ':' + arr(rep2.j?.data).length };
