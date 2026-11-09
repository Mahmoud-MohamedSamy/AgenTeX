// Read-only inventory of round-6 QA data on staging-crm.
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', C = '6f553963-01d6-4b68-9fb3-143d23044c41'; const out = {};
const nameOf = r => { const o = {}; for (const f of r.data || []) o[f.field] = f.value?.value; return o.first_name || o.deal_name || o.name || o.last_name || ''; };
const scan = async (mod, re, pages = 5) => { const hits = []; for (let p = 1; p <= pages; p++) { const a = arr((await api('GET', `/modules/${mod}/records?page=${p}&per_page=100&sort_by=created_at&sort_dir=desc`)).j?.data); for (const r of a) { const n = nameOf(r); if (re.test(n)) hits.push(r.id.slice(0, 8) + ' ' + n); } if (a.length < 100) break; } return hits; };
out.leads = await scan(L, /^QA RT (2323|1823|2423|2302|2385|2298|1864)/);
out.deals = await scan(D, /^QA RT (2382|1302)/);
out.contacts = await scan(C, /QA RT 2323|QA RT 1823/);
out.wfRules = arr((await api('GET', '/workflow/rules?take=200')).j?.data).filter(r => /^QA RT/.test(r.name)).map(r => r.id.slice(0, 8) + ' ' + r.name);
out.assignRules = arr((await api('GET', '/workflow/assignment-rules?page_size=200&take=200')).j?.data).filter(r => /^QA RT/.test(r.name)).map(r => r.id.slice(0, 8) + ' ' + r.name);
out.blueprints = arr((await api('GET', `/modules/${L}/blueprints`)).j?.data).filter(b => /^QA RT/.test(b.definition?.name || b.name || '')).map(b => b.id.slice(0, 8) + ' ' + (b.definition?.name || b.name));
out.modules = arr((await api('GET', '/modules')).j?.data).filter(m => /qa_rt/.test(m.moduleKey || m.apiName || '') || /QA RT/.test(JSON.stringify(m.labels || ''))).map(m => m.id.slice(0, 8) + ' ' + (m.moduleKey || JSON.stringify(m.labels)) + ' ' + (m.status || ''));
out.layouts = arr((await api('GET', `/modules/${L}/layouts`)).j?.data).filter(l => /QA RT/.test(l.name)).map(l => l.id.slice(0, 8) + ' ' + l.name);
out.fields = arr((await api('GET', `/modules/${L}/fields`)).j?.data).filter(f => /qa_rt_(rollup|phone|email)_r6|lookup_contacts/.test(f.apiName || '')).map(f => f.id.slice(0, 8) + ' ' + f.apiName);
out.dealViews = arr((await api('GET', `/modules/${D}/views?kind=kanban`)).j?.data).concat(arr((await api('GET', `/modules/${D}/views`)).j?.data)).filter(v => /QA RT/.test(v.name || '')).map(v => v.id.slice(0, 8) + ' ' + v.name);
out.teamspaces = arr((await api('GET', '/teamspaces')).j?.data).filter(t => /QA RT/.test(t.name)).map(t => t.id.slice(0, 8) + ' ' + t.name + ' canManage=' + t.canManage);
return done(out);
