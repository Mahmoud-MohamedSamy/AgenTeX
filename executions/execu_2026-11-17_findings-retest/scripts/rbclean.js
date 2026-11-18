const KEYS = 'app_key=crm&app_key=iam&app_key=files&app_key=reporting&app_key=workflow&app_key=mail&app_key=desk';
let all = [], cur = null;
for (let i = 0; i < 40; i++) { const r = await api('GET', '/audit/recycle-bin/items?' + KEYS + '&limit=200' + (cur ? '&cursor=' + encodeURIComponent(cur) : '')); const it = arr(r.j); all = all.concat(it); cur = r.j && r.j.meta && r.j.meta.next_cursor; if (!cur || !it.length) break; }
const mine = all.filter(x => /QA RT21|QA RT22/.test(x.record_label || ''));
log({ scanned: all.length, mine: mine.map(x => (x.record_label) + ' [' + (x.app_key || '') + ']') });
for (let i = 0; i < mine.length; i += 25) { const r = await api('POST', '/audit/recycle-bin/delete', { ids: mine.slice(i, i + 25).map(x => x.id) }); log({ purge: r.s, t: r.s >= 300 ? r.t.slice(0, 200) : undefined }); }
