const out = {};
const s = await call('GET', `/search?q=${encodeURIComponent('QA W2')}&limit=50`);
const hits = (s.j.data.groups[0].hits || []).filter(h => h.module && h.module.key === 'leads');
out.searchLeadHits = hits.length; out.searchTotal = s.j.data.groups[0].total;
const ids = hits.map(h => h.id);
const vis = {};
for (const id of ids.slice(0, 12)) { const g = await call('GET', `/modules/${MODS.leads}/records/${id}`); vis[id.slice(0, 8)] = g.s; }
out.recordGetForHits = vis;
const l = await call('GET', `/modules/${MODS.leads}/records?page=1&per_page=100&layout_id=bf971461-2edc-45f2-b6e4-6e180aa64288`);
out.listCount = l.j.meta && l.j.meta.total_count; out.listHasQA = (l.j.data || []).filter(x => /QA W2/.test(JSON.stringify(x))).length;
return out;
