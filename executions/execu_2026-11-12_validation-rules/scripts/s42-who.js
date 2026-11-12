const mid = await modId(); const L = arr((await api('GET', '/modules/' + mid + '/layouts')).j.data).find(l => l.name === P + ' Layout'); const o = { L: L.id, hits: [] };
const r0 = await api('GET', '/modules/' + mid + '/records?limit=3'); o.keys = Object.keys(arr(r0.j && r0.j.data)[0] || {}); o.meta = JSON.stringify(r0.j && r0.j.meta).slice(0, 200);
const sr = await api('GET', '/modules/' + mid + '/records?limit=100&layout_id=' + L.id); o.filtered = sr.s + ' n=' + arr(sr.j && sr.j.data).length + ' ' + JSON.stringify(arr(sr.j && sr.j.data).map(r => [r.id, r.layout_id, (r.data || []).filter(x => /name|subject/.test(x.field)).map(x => x.value && x.value.value).join('/'), r.created_at, r.deleted_at])).slice(0, 1500);
return o;
