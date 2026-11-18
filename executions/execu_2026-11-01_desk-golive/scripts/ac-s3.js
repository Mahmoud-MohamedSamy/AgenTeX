const f = D((await api('GET', '/modules/' + TM + '/fields')).j); const L = f.items || f; out.f0 = JSON.stringify(L[0]).slice(0, 400); out.names = L.map(x => x.key || x.field_key || x.slug || x.id).join(' ');
const r = D((await api('GET', '/modules/' + TM + '/records?limit=1&sort=-created_at')).j); out.r = JSON.stringify(r).slice(0, 2500);
return fin({ out });
