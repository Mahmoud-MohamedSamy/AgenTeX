let items = [], cur = null; for (let k = 0; k < 40; k++) { const b = await api('GET', '/audit/recycle-bin/items?limit=200' + (cur ? '&cursor=' + encodeURIComponent(cur) : '')); items = items.concat(arr(b.j && b.j.data)); cur = b.j && b.j.meta && b.j.meta.next_cursor; if (!cur) break; }
const hit = items.filter(x => /VR1112/.test(x.record_label || ''));
const o = { scanned: items.length, hits: hit.map(x => [x.record_label, x.module_key, x.deleted_by_label, String(x.deleted_at).slice(0, 16)]) };
if (process.env.PURGE === '1' && hit.length) { const p = await api('POST', '/audit/recycle-bin/delete', { item_ids: hit.map(x => x.id), ids: hit.map(x => x.id) }); o.purge = p.s; LED('purged ' + hit.length + ' VR1112 bin items (other modules)'); }
return o;
