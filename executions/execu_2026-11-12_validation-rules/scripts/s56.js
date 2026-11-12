const mid = await modId(); const id = I.recs[I.recs.length - 1][1];
const g = await api('GET', '/modules/' + mid + '/records/' + id); const nm = (g.j.data.data || []).find(x => x.field === 'last_name').value.value;
const st = await api('GET', '/modules/' + mid + '/records/' + id + '/blueprint-state'); const tr = await api('GET', '/modules/' + mid + '/records/' + id + '/blueprint-transitions');
return { nm, layout: g.j.data.layout_id || g.j.data.created_with_layout_id, st: JSON.stringify(st.j).slice(0, 300), tr: JSON.stringify(tr.j).slice(0, 300) };
