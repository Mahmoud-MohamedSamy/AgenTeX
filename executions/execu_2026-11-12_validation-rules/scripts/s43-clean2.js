// delete every live record on the QA layout (names must contain VR1112), purge exactly those from the bin, then delete the layout
const mid = await modId(); const o = {};
const L = arr((await api('GET', '/modules/' + mid + '/layouts')).j.data).find(l => l.name === P + ' Layout'); if (!L) return 'no layout';
const ids = new Map();
for (let k = 0; k < 10; k++) { const r = await api('GET', '/modules/' + mid + '/records?limit=100&layout_id=' + L.id); const rows = arr(r.j && r.j.data); if (!rows.length) break; let n = 0;
  for (const x of rows) { const nm = (x.data || []).filter(d => /name|subject/.test(d.field)).map(d => d.value && d.value.value).join(' '); if (!/VR1112/.test(nm)) { o.foreign = (o.foreign || []).concat([x.id + ' ' + nm]); continue; } const d = await api('DELETE', '/modules/' + mid + '/records/' + x.id); if (d.s < 300) { ids.set(x.id, nm); n++; } }
  if (!n) break; }
o.deleted = ids.size; await sleep(3000);
let items = [], cur = null; for (let k = 0; k < 3; k++) { const b = await api('GET', '/audit/recycle-bin/items?limit=200' + (cur ? '&cursor=' + encodeURIComponent(cur) : '')); items = items.concat(arr(b.j && b.j.data)); cur = b.j && b.j.meta && b.j.meta.next_cursor; if (!cur) break; }
const extra = new Set((process.env.EXTRA_IDS || '').split(',').filter(Boolean));
const pick = items.filter(x => (ids.has(x.record_id) && /VR1112/.test(x.record_label || '')) || (extra.has(x.record_id) && /VR1112|BADCONV|^QA$/.test(x.record_label || '')));
o.pick = pick.length + '/' + (ids.size + extra.size);
if (pick.length) { const p = await api('POST', '/audit/recycle-bin/delete', { item_ids: pick.map(x => x.id), ids: pick.map(x => x.id) }); o.purge = SR(p).slice(0, 100); LED('purged ' + pick.length + ' bin items by exact id'); }
await sleep(2000);
if (process.env.KEEP_LAYOUT !== '1') { const d = await api('DELETE', '/modules/' + mid + '/layouts/' + L.id); o.layoutDel = SR(d).slice(0, 200); if (d.s < 300) LED('deleted layout ' + L.id); }
return o;
