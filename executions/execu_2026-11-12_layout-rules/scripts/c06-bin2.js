const out = { qa: [], today: [] }; let cursor = null;
for (let p = 0; p < 30; p++) { const r = await api('GET', '/audit/recycle-bin/items?app_key=crm&limit=100' + (cursor ? '&cursor=' + encodeURIComponent(cursor) : '')); const items = arr(r.j && r.j.data && (r.j.data.items || r.j.data));
  for (const i of items) { if (/QA LR1112|qa_lr/i.test(i.record_label || '')) out.qa.push([i.id, i.module_key, i.record_id, i.record_label]); else if (i.module_key === 'leads' && String(i.deleted_at).startsWith('2026-11-12')) out.today.push([i.record_id.slice(0, 8), i.record_label, i.deleted_at]); }
  cursor = r.j && r.j.meta && (r.j.meta.next_cursor || r.j.meta.nextCursor); if (!cursor) break; }
return out;
