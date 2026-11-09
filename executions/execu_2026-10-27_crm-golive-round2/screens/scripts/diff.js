const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const mods = { leads: L, contacts: '6f553963-01d6-4b68-9fb3-143d23044c41', deals: 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', accounts: 'b2398920-2914-4836-be53-81bd960effea', tasks: 'a9d87b62-b704-4c2e-b2d5-1b745d7c2065', cases: '64d25249-e282-49a6-ad9d-c840004ede0d' };
out.qaLeft = {};
for (const [k, id] of Object.entries(mods)) { const r = await api('GET', `/modules/${id}/records?page=1&per_page=100&sort_by=created_at&sort_dir=desc`); out.qaLeft[k] = ((r.j && r.j.data) || []).filter(x => JSON.stringify(x.data || '').includes('QA R2SC')).map(x => x.id); }
// bin
let cur = null, qa = [], n = 0;
for (let p = 0; p < 6; p++) { const b = await api('GET', '/audit/recycle-bin/items?limit=200' + (cur ? '&cursor=' + encodeURIComponent(cur) : '')); const d = Array.isArray(b.j.data) ? b.j.data : (b.j.data.items || []); n += d.length; qa.push(...d.filter(i => JSON.stringify(i).includes('QA R2SC')).map(i => i.id)); cur = b.j.meta && b.j.meta.next_cursor; if (!cur || !d.length) break; }
out.binScanned = n; out.binQA = qa;
// kanban views leftover
const vs = await api('GET', `/modules/${mods.deals}/views?kind=kanban`); const list = (vs.j && vs.j.data && (vs.j.data.views || vs.j.data)) || [];
out.kanbanQAViews = (Array.isArray(list) ? list : []).filter(v => /QA R2SC/.test(v.name || '')).map(v => v.name);
out.company = (await api('GET', '/iam/tenant/company-profile')).j.data.time_zone;
out.bh = JSON.stringify((await api('GET', '/iam/tenant/business-hours')).j.data).slice(0, 120);
