// Round 8 inventory part 2 (READ-ONLY): QA modules by full id, record portals, calls named "QA RT r8".
const out = {};
for (const id of ['064aa360-7e4b-4e0b-9e68-831c469fa6e9', 'b690647a-27b1-45b2-bcc9-0c8c185e1e5a', 'b97a713b-1da4-4a14-a100-490575c7367f']) { const r = await api('GET', `/modules/${id}`); out['module ' + id.slice(0, 8)] = r.s + ' ' + (r.j?.data?.moduleKey || r.j?.data?.apiName || '') + ' ' + (r.j?.data?.status || r.j?.data?.isDeleted || ''); }
const pr = await api('GET', '/record-portals'); out.portals = pr.s + ' ' + JSON.stringify(arr(pr.j?.data).filter(p => /QA RT r8/.test(p.name) || String(p.id).startsWith('e9b9b750')).map(p => ({ id: p.id, n: p.name, on: p.is_enabled })));
const mods = arr((await api('GET', '/modules')).j?.data); const c = mods.find(m => /call/i.test(m.apiName || m.api_name || m.moduleKey || ''));
out.callsModule = c ? (c.apiName || c.moduleKey) + ' ' + c.id : 'none';
if (c) { const a = []; for (let p = 1; p <= 5; p++) { const x = arr((await api('GET', `/modules/${c.id}/records?page=${p}`)).j?.data); a.push(...x); if (x.length < 100) break; } out.calls = a.filter(r => JSON.stringify(r.data).includes('QA RT r8') || r.id.startsWith('cd52350c')).map(r => r.id); }
return out;
