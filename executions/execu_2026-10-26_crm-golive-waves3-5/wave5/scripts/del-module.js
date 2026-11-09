const out = {};
const delMod = async id => { const ids = []; for (let p = 0; p < 20; p++) { const r = await call('GET', `/modules/${id}/records?page=1&per_page=100`); const rows = r.s === 200 ? r.j.data : []; if (!rows || !rows.length) break; for (const x of rows) { await call('DELETE', `/modules/${id}/records/${x.id}`); ids.push(x.id); } }
  await new Promise(z => setTimeout(z, 3000)); const all = []; let cur = null; for (let p = 0; p < 20; p++) { const r = await call('GET', '/audit/recycle-bin/items?limit=200' + (cur ? '&cursor=' + encodeURIComponent(cur) : '')); const d = Array.isArray(r.j.data) ? r.j.data : r.j.data.items; all.push(...d); cur = r.j.meta && r.j.meta.next_cursor; if (!cur || !d.length) break; }
  const items = all.filter(x => ids.includes(x.record_id)).map(x => x.id); for (let i = 0; i < items.length; i += 50) await call('POST', '/audit/recycle-bin/delete', { ids: items.slice(i, i + 50) });
  const d = await call('DELETE', `/modules/${id}?cascade=true`); return ids.length + ' records, ' + items.length + ' purged, delete module ' + d.s + ' ' + d.t.slice(0, 150); };
for (const id of (globalThis.__del || ['27964476-a1e9-4867-9638-76e9d211e1a8'])) out[id.slice(0, 8)] = await delMod(id);
return out;
