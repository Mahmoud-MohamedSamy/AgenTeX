const r = await api('GET', '/fields/datatypes'); out.keys = arr(D(r.j)).map(d => d.key).join(' ');
const ex = await api('GET', '/modules/' + CM + '/fields'); out.sample = arr(D(ex.j)).filter(f => /pick|multi|check|url|number|integer/.test(f.datatypeKey)).slice(0, 4).map(f => f.datatypeKey + ' ' + JSON.stringify(f.datatypeOptions).slice(0, 150));
return fin({ out });
