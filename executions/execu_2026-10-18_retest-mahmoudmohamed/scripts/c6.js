// Cleanup step 6: purge the remaining "QA RT …" items (POST /audit/recycle-bin/delete {ids}), then verify none are left.
const base = 'app_key=crm&app_key=iam&app_key=files&app_key=reporting&app_key=workflow&app_key=mail&limit=200';
const list = async () => { let all = [], cur = null; for (let p = 0; p < 20; p++) { const r = await api('GET', '/audit/recycle-bin/items?' + base + (cur ? '&cursor=' + encodeURIComponent(cur) : '')); const it = arr(r.j && r.j.data); all = all.concat(it); cur = r.j && r.j.meta && r.j.meta.next_cursor; if (!cur || !it.length) break; } return all; };
const out = {}; let all = await list();
out.del1821 = all.filter(x => /1821|del-list|del-wq/.test(x.record_label || '')).map(x => x.record_label + '|' + x.deleted_at);
const qa = all.filter(x => /^QA RT /.test(x.record_label || '')); out.toPurge = qa.length;
for (let i = 0; i < qa.length; i += 25) { const r = await api('POST', '/audit/recycle-bin/delete', { ids: qa.slice(i, i + 25).map(x => x.id) }); out['batch' + i] = r.s + (r.s >= 300 ? ' ' + r.t.slice(0, 160) : ''); }
await sleep(3000); all = await list(); out.left = all.filter(x => /^QA RT /.test(x.record_label || '')).map(x => x.record_label);
return done(out);
