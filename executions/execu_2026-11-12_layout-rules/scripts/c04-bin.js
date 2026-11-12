const gone = JSON.parse(fs.readFileSync(RUN + '/out/cleanup-crm-gone.json', 'utf8')); const ids = new Set(gone.map(g => g[1]));
const out = { scanned: 0, match: [], keysSeen: '' }; let cursor = null; const pick = [];
for (let p = 0; p < 30; p++) { const r = await api('GET', '/audit/recycle-bin/items?app_key=crm&limit=100' + (cursor ? '&cursor=' + encodeURIComponent(cursor) : '')); const items = arr(r.j && r.j.data && (r.j.data.items || r.j.data)); if (!out.keysSeen && items[0]) out.keysSeen = Object.keys(items[0]).join(','); out.scanned += items.length;
  for (const i of items) if (ids.has(i.record_id) && /QA LR1112|qa_lr/i.test(String(i.record_label || '') + JSON.stringify(i.snapshot || i.data || ''))) pick.push(i);
  else if (ids.has(i.record_id)) out.match.push('id-only ' + i.module_key + ' ' + i.record_label);
  cursor = r.j && r.j.meta && (r.j.meta.next_cursor || r.j.meta.nextCursor); if (!cursor) break; }
out.pick = pick.length; out.pickByMod = pick.reduce((a, i) => (a[i.module_key] = (a[i.module_key] || 0) + 1, a), {});
if (pick.length) { const d = await api('POST', '/audit/recycle-bin/delete', { ids: pick.map(i => i.id) }); out.purge = SR(d).slice(0, 200); }
return out;
