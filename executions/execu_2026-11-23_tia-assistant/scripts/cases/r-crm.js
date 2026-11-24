const M = { leads:'841043e1-c078-41f9-8d6e-dfd61bee45c3', contacts:'6f553963-01d6-4b68-9fb3-143d23044c41', accounts:'b2398920-2914-4836-be53-81bd960effea', deals:'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430' };
const del = { leads: [CRMIDS['QA TIA Lead 1'], CRMIDS['QA TIA Lead 2'], CRMIDS['QA TIA Lead 3'], 'bee14c37-77dd-4026-8b6a-13d8a8145489'], deals: [CRMIDS['QA TIA Deal 1000'], CRMIDS['QA TIA Deal 2500'], CRMIDS['QA TIA Deal 4000']], contacts: [CRMIDS['QA TIA Contact A'], CRMIDS['QA TIA Contact B'], '800d345d-68dd-450f-b0ab-541a4f9d10af', 'dea3784b-f478-4ed3-ae7c-9ec3d667166c', 'ab3f227d-3d53-4cfb-ba5f-6ac9c6a7bea7'], accounts: [CRMIDS['QA TIA Account']] };
const out = {};
for (const [k, ids] of Object.entries(del)) out[k] = (await Promise.all(ids.map(id => api('DELETE', `/modules/${M[k]}/records/${id}`)))).map(r => r.s).join(',');
const wf = await api('DELETE', '/workflow/rules/b4170de0-0058-4e9c-bbcc-29c32536bb5b'); out.wf = wf.s + ' ' + (wf.j?.error?.code || '');
// leftovers: any QA TIA in the 4 modules
const flat = x => { const o = {}; for (const f of (x.data || [])) o[f.field] = f.value?.value ?? f.value; return o; };
out.left = {}; for (const [k, id] of Object.entries(M)) { const rows = arr((await api('GET', `/modules/${id}/records?page=1&page_size=100`)).j?.data).map(flat); out.left[k] = rows.filter(o => /QA TIA/.test(JSON.stringify([o.name, o.deal_name, o.first_name, o.last_name]))).length; }
out.wfLeft = arr((await api('GET', '/workflow/rules?take=200')).j?.data).filter(r => /Call the lead|QA TIA/.test(r.name || '')).length;
return out;
