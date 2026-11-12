const mid = await modId(); const out = {};
for (const q of ['?layout_id=' + I.layout + '&limit=50', '?layoutId=' + I.layout + '&limit=50']) { const r = await api('GET', '/modules/' + mid + '/records' + q); out[q.slice(0, 12)] = r.s + ' ' + arr(r.j && r.j.data).filter(x => x.layout_id === I.layout).map(x => x.id + ' ' + JSON.stringify((x.data || []).filter(d => /name|subject/.test(d.field)).map(d => d.value.value))).join(' ; ').slice(0, 1500); }
return out;
