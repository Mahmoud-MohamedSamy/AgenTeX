out.t = [];
for (const q of ['q', 'search', 'query']) { const r = await api('GET', '/audit/recycle-bin/items?app_key=desk&limit=200&' + q + '=' + encodeURIComponent('QA AC')); const L = arr(D(r.j)); out.t.push(q + ' ' + r.s + ' n=' + L.length + ' mine=' + L.filter(x => /^QA AC /.test(x.record_label || '')).length + ' first=' + (L[0] && L[0].record_label)); }
const r = await api('GET', '/audit/recycle-bin/items?app_key=desk&limit=5'); out.sample = JSON.stringify(arr(D(r.j))[0] || {}).slice(0, 500);
const ids = Object.values(TK); const r2 = await api('GET', '/audit/recycle-bin/items?app_key=desk&limit=200&record_id=' + ids[0]); out.byId = r2.s + ' ' + r2.t.slice(0, 200);
return fin({ out });
