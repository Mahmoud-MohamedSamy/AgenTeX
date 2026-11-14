const r = await api('GET', '/audit/recycle-bin/items?limit=200&app=desk'); const items = arr(D(r.j)); out.n = items.length; out.keys = Object.keys(items[0] || {});
out.tickets = items.filter(i => /ticket/i.test(JSON.stringify(i).slice(0, 400))).slice(0, 40).map(i => JSON.stringify(i).slice(0, 260));
return fin({ out });
