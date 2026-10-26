// Cleanup CRM (round 4). Inventory by "QA RT" names created this round + known ids.
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', C = '6f553963-01d6-4b68-9fb3-143d23044c41', LT = '6261fa51-b6e7-4c73-a83d-f6ecbd6260d1';
const out = {}; const since = '2026-10-25T20:40:00Z';
const nameOf = r => { const d = r.data || []; for (const k of ['first_name', 'name', 'deal_name', 'last_name']) { const v = d.find(x => x.field === k)?.value?.value; if (v) return v; } return ''; };
const mine = async m => { const ids = []; for (let p = 1; p < 6; p++) { const a = arr((await api('GET', `/modules/${m}/records?page=${p}&per_page=200&sort=created_at&order=desc`)).j?.data); for (const x of a) if (x.created_at >= since && /QA RT/.test(nameOf(x))) ids.push(x.id); if (a.length < 200 || (a.at(-1)?.created_at || '') < since) break; } return ids; };
for (const [k, m] of [['leads', L], ['deals', D], ['contacts', C]]) { const ids = await mine(m); const r = {}; for (const id of ids) { const s = (await api('DELETE', `/modules/${m}/records/${id}`)).s; r[s] = (r[s] || 0) + 1; } out[k] = r; }
const fs = arr((await api('GET', `/modules/${L}/fields`)).j?.data).filter(f => /^qa_rt_(fp|ro|uniq)$/.test(f.fieldName)); out.fields = {}; for (const f of fs) out.fields[f.fieldName] = (await api('DELETE', `/modules/${L}/fields/${f.id}`)).s;
out.layoutDup = (await api('DELETE', `/modules/${L}/layouts/dff47b4e-2124-483a-b968-85dfa21a2b4c`)).s;
const lay = (await api('GET', `/modules/${L}/layouts/${LT}`)).j.data; const b = { ...lay }; delete b.id; b.moduleImageEnabled = true; out.testImage = (await api('PUT', `/modules/${L}/layouts/${LT}`, b)).s + ' now=' + (await api('GET', `/modules/${L}/layouts/${LT}`)).j.data.moduleImageEnabled;
out.modules = {}; for (const id of ['ef70c152-140d-4b45-be18-7f98f9f5ea98', 'c56f2e10-a21b-41d9-956f-38534c416295']) out.modules[id.slice(0, 8)] = (await api('DELETE', `/modules/${id}?cascade=true`)).s;
out.teamspace = (await api('DELETE', '/teamspaces/a1a9bba3-f8ea-4a1e-b3df-b5eed5bdc023?cascade=true')).s;
out.tsLeft = arr((await api('GET', '/teamspaces')).j?.data).map(t => t.name);
return done(out);
