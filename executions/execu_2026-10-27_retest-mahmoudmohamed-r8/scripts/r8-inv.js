// Round 8 cleanup inventory (READ-ONLY) on NDC-Staging CRM: full ids for every ledger.md item (matched by short id / name).
const out = {}; const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', TK = 'a9d87b62-b704-4c2e-b2d5-1b745d7c2065';
const val = (r, k) => { const f = (Array.isArray(r.data) ? r.data : []).find(x => x.field === k); return f && (f.value?.value ?? f.value?.stringValue ?? null); };
const nm = r => ['first_name', 'last_name', 'name', 'subject', 'title', 'deal_name'].map(k => val(r, k)).find(v => v) || '';
const mods = arr((await api('GET', '/modules')).j?.data).map(m => ({ id: m.id, key: m.apiName || m.api_name || m.moduleKey, label: m.name || m.label?.en }));
out.modules = mods.filter(m => /^qa_rt_r8/.test(m.key) || ['064aa360', 'b690647a', 'b97a713b'].includes(m.id.slice(0, 8)));
const calls = mods.find(m => m.key === 'calls');
const scan = async (mid, test, pages = 12) => { const hits = []; for (let p = 1; p <= pages; p++) { const a = arr((await api('GET', `/modules/${mid}/records?page=${p}`)).j?.data); if (!a.length) break; for (const r of a) if (test(r)) hits.push({ id: r.id, n: nm(r).slice(0, 60), at: String(r.created_at).slice(0, 10) }); if (String(a.at(-1).created_at) < '2026-10-26' || a.length < 100) break; } return hits; };
out.leads = await scan(L, r => /^(QA RT r8|QA W4 Send)/.test(nm(r)) || ['bba3bc66', '3b0b6ece', '677aaeb6', 'cc2bb773', '8c430ec9', 'e8e8c1dd'].includes(r.id.slice(0, 8)));
out.deals = await scan(D, r => /^QA RT r8/.test(nm(r)) || r.id.startsWith('a60da2df'));
out.calls = calls ? await scan(calls.id, r => /^QA RT r8/.test(nm(r)) || r.id.startsWith('cd52350c')) : 'no calls module';
out.calls_module = calls?.id;
out.rules = arr((await api('GET', '/workflow/rules?take=500')).j?.data).filter(x => /^QA RT r8/.test(x.name) || ['b28e7bfb', 'a568dbf5'].includes(String(x.id).slice(0, 8))).map(x => ({ id: x.id, n: x.name, active: x.isActive }));
out.assign = arr((await api('GET', '/workflow/assignment-rules')).j?.data).filter(x => /^QA RT r8/.test(x.name) || String(x.id).startsWith('54dbfced')).map(x => ({ id: x.id, n: x.name, active: x.isActive }));
out.layouts = {}; for (const [k, m] of [['leads', L], ['deals', D], ['tasks', TK]]) out.layouts[k] = arr((await api('GET', `/modules/${m}/layouts`)).j?.data).filter(l => /^QA AEO Layout|^QA RT r8|^New Layout$/.test(l.name) || String(l.id).startsWith('78288b9b')).map(l => ({ id: l.id, n: l.name, module: m }));
const pr = await api('GET', '/portals'); out.portals = { s: pr.s, items: arr(pr.j?.data).filter(p => /^QA RT r8/.test(p.name) || String(p.id).startsWith('e9b9b750')).map(p => ({ id: p.id, n: p.name, enabled: p.is_enabled })) };
out.counts = { modules: out.modules.length, leads: out.leads.length, deals: out.deals.length, calls: Array.isArray(out.calls) ? out.calls.length : out.calls, rules: out.rules.length, assign: out.assign.length, layouts: Object.fromEntries(Object.entries(out.layouts).map(([k, v]) => [k, v.length])), portals: out.portals.items.length };
return out;
