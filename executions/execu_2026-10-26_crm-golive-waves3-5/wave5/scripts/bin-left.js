const all = []; let cur = null; for (let p = 0; p < 20; p++) { const r = await call('GET', '/audit/recycle-bin/items?limit=200' + (cur ? '&cursor=' + encodeURIComponent(cur) : '')); const d = Array.isArray(r.j.data) ? r.j.data : r.j.data.items; all.push(...d); cur = r.j.meta && r.j.meta.next_cursor; if (!cur || !d.length) break; }
const qa = all.filter(x => /QA W5/i.test(x.record_label || '') || /qa_w5/.test(x.module_key || ''));
const by = {}; for (const x of qa) by[x.module_key] = (by[x.module_key] || 0) + 1;
return { count: qa.length, byModule: by, deletedAt: [...new Set(qa.map(x => (x.deleted_at || '').slice(0, 16)))], expires: [...new Set(qa.map(x => (x.expires_at || '').slice(0, 10)))] };
