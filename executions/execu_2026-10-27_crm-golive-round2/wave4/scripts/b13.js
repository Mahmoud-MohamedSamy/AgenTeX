// Round 2 Wave 4 batch 13 (read-only): recycle-bin items that are QA R2W4 objects, with their record ids.
const arr = v => Array.isArray(v) ? v : (v && (v.items || v.data)) || [];
const out = { items: [] }; let cursor = null, seen = 0;
for (let p = 0; p < 1; p++) { const r = await call('GET', `/audit/recycle-bin/items?limit=100${cursor ? '&cursor=' + encodeURIComponent(cursor) : ''}`);
  const items = arr(r.j && r.j.data); seen += items.length;
  for (const i of items.filter(x => /QA R2W4/.test(JSON.stringify(x)))) out.items.push(`${i.id} | rec ${i.record_id || i.entity_id || ''} | ${i.record_label || i.label || ''} | ${i.deleted_at || ''} | by ${i.deleted_by_name || i.deleted_by || ''}`);
  cursor = r.j && r.j.meta && (r.j.meta.next_cursor || r.j.meta.nextCursor); if (!cursor) break; }
out.seen = seen; return out;
