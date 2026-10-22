const items = []; let cur = null;
for (let i = 0; i < 15; i++) { const r = await api('GET', `/audit/recycle-bin/items?app_key=crm&app_key=iam&app_key=files&app_key=reporting&app_key=workflow&app_key=mail&limit=200${cur ? '&cursor=' + encodeURIComponent(cur) : ''}`); items.push(...arr(r.j?.data)); cur = r.j?.meta?.next_cursor; if (!cur) break; }
const mine = items.filter(x => /^QA RT /.test(x.record_label || '') || /qa_rt|QA RT/.test(x.record_label || ''));
const res = [];
for (let i = 0; i < mine.length; i += 25) { const r = await api('POST', '/audit/recycle-bin/delete', { ids: mine.slice(i, i + 25).map(x => x.id) }); res.push(r.s + ' ' + r.t.slice(0, 160)); }
const left = []; cur = null; for (let i = 0; i < 15; i++) { const r = await api('GET', `/audit/recycle-bin/items?app_key=crm&app_key=iam&app_key=files&app_key=reporting&app_key=workflow&app_key=mail&limit=200${cur ? '&cursor=' + encodeURIComponent(cur) : ''}`); left.push(...arr(r.j?.data).filter(x => /QA RT|qa_rt/.test(x.record_label || ''))); cur = r.j?.meta?.next_cursor; if (!cur) break; }
return done({ found: mine.length, labels: [...new Set(mine.map(x => x.module_key + ':' + x.record_label))].slice(0, 40), res, left: left.length });
