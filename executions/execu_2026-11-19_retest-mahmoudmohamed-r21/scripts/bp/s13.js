const a = await api('GET', '/audit/events?limit=100'); const b = await api('GET', '/audit/events?limit=100&page=1');
return { a: a.s + ' ' + JSON.stringify(a.j?.meta), b: E(b) };
