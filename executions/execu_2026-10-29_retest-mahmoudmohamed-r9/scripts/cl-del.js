// Round-6 cleanup (after Plane, 27 Oct). Every item is re-read and must still carry a QA RT / qa_rt name before it is deleted.
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', C = '6f553963-01d6-4b68-9fb3-143d23044c41', SUB = '6d053261';
const res = []; const log = (what, s) => res.push(what + ' → ' + s);
const recName = async (m, id) => { const g = await api('GET', `/modules/${m}/records/${id}`); if (g.s !== 200) return null; const o = {}; for (const f of g.j?.data?.data || []) o[f.field] = f.value?.value; return JSON.stringify(o); };
// rules
for (const id of ['1448ac2e-4b69-40f4-b4de-20dd5c19c2d3']) { const g = (await api('GET', `/workflow/rules/${id}`)).j?.data; if (/^QA RT/.test(g?.name || '')) log('wf ' + g.name, (await api('DELETE', `/workflow/rules/${id}`)).s); }
const ars = arr((await api('GET', '/workflow/assignment-rules?page_size=200&take=200')).j?.data).filter(r => /^QA RT 2298/.test(r.name));
for (const r of ars) log('assignment ' + r.name, (await api('DELETE', `/workflow/assignment-rules/${r.id}`)).s);
const bps = arr((await api('GET', `/modules/${L}/blueprints`)).j?.data).filter(b => /^QA RT 2302/.test(b.definition?.name || ''));
for (const b of bps) log('blueprint ' + b.definition.name, (await api('DELETE', `/modules/${L}/blueprints/${b.id}`)).s);
// records
const recs = [[L, ['f814b24e-0252-4cf3-9e0e-1c29fbe16474', 'e512668a-fc8d-47ac-a0ab-5717a6de0f7b', '96061733-d364-4de9-b6d9-f400dd6311fe', '2acfe5f8-7ba3-466b-9e54-077c903ba2d6', 'af215ad6-d34a-4cfb-aaa3-9704483fd125', '5898eb60-6024-4d73-ab96-df88657153f0', '3a22e4a4-5b26-441e-905c-c5fb4f3315ce']],
  [D, ['bfd949ed-4543-41f1-9b8a-70618e90ed83', 'd13c0de2-ef2e-4848-b170-41f42c307806', 'bffaa096-ad53-4c75-ba2b-78fedc188ad6', '0e718071-bd95-4c55-8c5d-b6b70b3d1c25']]];
const subMod = arr((await api('GET', '/modules')).j?.data).find(m => m.id.startsWith(SUB))?.id;
const ct = arr((await api('GET', `/modules/${C}/records?page=1&per_page=50&sort_by=created_at&sort_dir=desc`)).j?.data).filter(r => JSON.stringify(r.data || []).includes('QA RT 2323')).map(r => r.id);
recs.push([C, ct]); if (subMod) recs.push([subMod, ['01182b6d-a107-4a50-80b7-5f9082eb412c']]);
for (const [m, ids] of recs) for (const id of ids) { const n = await recName(m, id); if (!n) { log('record ' + id.slice(0, 8), 'gone'); continue; } if (!/QA RT/.test(n)) { log('record ' + id.slice(0, 8), 'SKIPPED (not QA)'); continue; } log('record ' + id.slice(0, 8), (await api('DELETE', `/modules/${m}/records/${id}`)).s); }
// kanban view
const v = arr((await api('GET', `/modules/${D}/views?kind=kanban`)).j?.data?.views).find(x => x.name === 'QA RT 2282 kb'); if (v) log('view QA RT 2282 kb', (await api('DELETE', `/modules/${D}/views/${v.id}`)).s);
// fields, layout, module
const fl = arr((await api('GET', `/modules/${L}/fields`)).j?.data).filter(f => /^qa_rt_(rollup|phone|email)_r6$/.test(f.apiName || ''));
const lay = arr((await api('GET', `/modules/${L}/layouts`)).j?.data).find(l => l.name === 'QA RT r6 layout');
if (lay) log('layout QA RT r6 layout', (await api('DELETE', `/modules/${L}/layouts/${lay.id}`)).s);
for (const f of fl) log('field ' + f.apiName, (await api('DELETE', `/modules/${L}/fields/${f.id}`)).s);
const mod = arr((await api('GET', '/modules')).j?.data).find(m => m.moduleKey === 'qa_rt_partners'); if (mod) log('module qa_rt_partners', (await api('DELETE', `/modules/${mod.id}?cascade=true`)).s);
return done(res);
