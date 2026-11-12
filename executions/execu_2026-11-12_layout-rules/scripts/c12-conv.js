const L = I.mod_leads; const id = 'e4e1c588-75f7-40c7-9715-f471db5e7b7c'; const out = {};
const g = await api('GET', '/modules/' + L + '/records/' + id); out.get = g.s + ' ' + (g.j && g.j.data ? g.j.data.created_with_layout_id + ' del=' + g.j.data.is_deleted + ' ' + JSON.stringify(g.j.data.data).slice(0, 120) : g.t.slice(0, 150));
if (g.s === 200) { out.del = SR(await api('DELETE', '/modules/' + L + '/records/' + id)).slice(0, 200); }
out.layout = SR(await api('DELETE', '/modules/' + L + '/layouts/' + I.layout)).slice(0, 200);
return out;
