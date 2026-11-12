const id = I.contact; let items = [], cur = null; for (let k = 0; k < 3; k++) { const b = await api('GET', '/audit/recycle-bin/items?limit=200' + (cur ? '&cursor=' + encodeURIComponent(cur) : '')); items = items.concat(arr(b.j && b.j.data)); cur = b.j && b.j.meta && b.j.meta.next_cursor; if (!cur) break; }
const it = items.filter(x => x.record_id === id); const o = { found: it.map(x => x.record_label + ' ' + x.module_key) };
const ok = it.filter(x => /VR1112|qa\.vr1112@example\.com/i.test(x.record_label || ''));
if (ok.length) { const p = await api('POST', '/audit/recycle-bin/delete', { item_ids: ok.map(x => x.id), ids: ok.map(x => x.id) }); o.purge = p.s; LED('purged desk contact ' + id); }
return o;
