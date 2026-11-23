const M = { leads:'841043e1-c078-41f9-8d6e-dfd61bee45c3', deals:'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430' };
const ids = JSON.parse(fs.readFileSync('../out/p07-crm-ids.json','utf8')).ids;
const out = {};
for (const k of ['QA TIA Lead 1','QA TIA Deal 2500']) { const mod = k.includes('Deal') ? M.deals : M.leads; const r = await api('GET', `/modules/${mod}/records/${ids[k]}`); out[k] = r.s; }
const r = await api('GET', `/modules/${M.leads}/records?page=1&page_size=5`); out.leadsList = { s: r.s, total: r.j?.meta?.total ?? r.j?.meta?.totalCount };
const st = await api('GET', '/agents/tia/status'); out.tia = st.j?.data;
return out;
