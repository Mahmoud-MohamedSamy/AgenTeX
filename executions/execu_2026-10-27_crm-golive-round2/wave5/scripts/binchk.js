const all = []; let cur = null; for (let p = 0; p < 30; p++) { const r = await call('GET', '/audit/recycle-bin/items?limit=200' + (cur ? '&cursor=' + encodeURIComponent(cur) : '')); const d = Array.isArray(r.j.data) ? r.j.data : (r.j.data.items || []); all.push(...d); cur = r.j.meta && r.j.meta.next_cursor; if (!cur || !d.length) break; }
const mine = all.filter(x => /QA R2W5|QA W5/i.test(JSON.stringify(x)) || /qa_r2w5|qa_w5/.test(x.module_key || ''));
return { total: all.length, mine: mine.map(x => [x.id, x.module_key, x.record_label || x.name, x.deleted_at].join(' | ')).slice(0, 30) };
