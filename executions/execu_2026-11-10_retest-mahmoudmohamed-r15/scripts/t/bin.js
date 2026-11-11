const APPK = process.env.BINAPPS || 'app_key=desk';
const all = []; let cur = '';
for (let i = 0; i < 20; i++) { const r = await api('GET', `/audit/recycle-bin/items?${APPK}&limit=200${cur ? '&cursor=' + encodeURIComponent(cur) : ''}`); if (r.s !== 200) { log('list', r.s, r.t.slice(0, 200)); break; } all.push(...arr(r.j)); cur = r.j?.meta?.next_cursor; if (!cur) break; }
const mine = all.filter(x => /^QA RT15/.test(x.record_label || ''));
log('bin total', all.length, 'QA RT15', mine.length, 'others', all.length - mine.length);
if (process.env.PURGE !== '1') return mine.slice(0, 5).map(x => x.record_label);
let ok = 0; for (let i = 0; i < mine.length; i += 25) { const r = await api('POST', '/audit/recycle-bin/delete', { ids: mine.slice(i, i + 25).map(x => x.id) }); if (r.s < 300) ok += Math.min(25, mine.length - i); else log('purge', r.s, r.t.slice(0, 200)); }
return { purged: ok };
