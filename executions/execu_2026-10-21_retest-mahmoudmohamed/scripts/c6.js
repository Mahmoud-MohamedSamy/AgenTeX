const out = {};
for (const id of ['c0394292-52a2-446d-a326-06733fe289ba', '9ef906c2-bdbd-4765-a600-3c724801cc71']) {
  let n = 0; for (let k = 0; k < 5; k++) { const recs = arr((await api('GET', `/modules/${id}/records?page=1&per_page=100`)).j?.data); if (!recs.length) break; for (const r of recs) { if ((await api('DELETE', `/modules/${id}/records/${r.id}`)).s < 300) n++; } }
  const d = await api('DELETE', `/modules/${id}?cascade=true`); out[id.slice(0, 8)] = n + ' records deleted; module ' + d.s + ' ' + (d.s >= 300 ? d.t.slice(0, 140) : '');
}
out.left = (await mods()).filter(m => /qa_rt/.test(m.moduleKey)).map(m => m.moduleKey);
// desk recycle bin
const items = []; let cur = null; for (let i = 0; i < 10; i++) { const r = await api('GET', `/audit/recycle-bin/items?app_key=desk&limit=200${cur ? '&cursor=' + encodeURIComponent(cur) : ''}`); items.push(...arr(r.j?.data)); cur = r.j?.meta?.next_cursor; if (!cur) break; }
const mine = items.filter(x => /QA RT|qa_rt/.test((x.record_label || '') + ' ' + (x.module_key || '')));
const res = []; for (let i = 0; i < mine.length; i += 25) { const r = await api('POST', '/audit/recycle-bin/delete', { ids: mine.slice(i, i + 25).map(x => x.id) }); res.push(r.s + ' ' + r.t.slice(0, 220)); }
out.binFound = mine.length; out.binRes = res;
return done(out);
