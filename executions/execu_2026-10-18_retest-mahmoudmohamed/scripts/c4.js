// Cleanup step 4: permanently delete this round's items ("QA RT …") from the Recycle Bin.
const base = 'app_key=crm&app_key=iam&app_key=files&app_key=reporting&app_key=workflow&app_key=mail&limit=200';
const out = { pages: 0, purge: {} }; let all = []; let cur = null;
for (let p = 0; p < 20; p++) { const r = await api('GET', '/audit/recycle-bin/items?' + base + (cur ? '&cursor=' + encodeURIComponent(cur) : '')); out.pages++;
  const it = arr(r.j && r.j.data); all = all.concat(it); cur = r.j && r.j.meta && r.j.meta.next_cursor; if (!cur || !it.length) break; }
const qa = all.filter(x => /^QA RT /.test(x.record_label || '')); out.seen = all.length; out.qa = qa.length;
out.byModule = qa.reduce((a, x) => (a[x.module_key] = (a[x.module_key] || 0) + 1, a), {});
const tryDel = async id => { for (const [m, p] of [['DELETE', '/audit/recycle-bin/items/' + id], ['POST', '/audit/recycle-bin/items/' + id + '/purge'], ['DELETE', '/audit/recycle-bin/items/' + id + '/permanent']]) { const r = await api(m, p); if (r.s < 300) return m + ' ' + p.replace(id, '{id}') + ' ' + r.s; out.tries = (out.tries || []).concat(m + ' ' + p.replace(id, '{id}') + ' ' + r.s); } return null; };
if (qa.length) { out.method = await tryDel(qa[0].id);
  if (out.method) { const [m, pth] = out.method.split(' '); for (const x of qa.slice(1)) { const r = await api(m, pth.replace('{id}', x.id)); out.purge[r.s] = (out.purge[r.s] || 0) + 1; } } }
return done(out);
