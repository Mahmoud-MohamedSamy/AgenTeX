const id = 'd6a5dc8b-b8ce-412d-8ce0-cace7f8595a8'; const r = await api('GET', '/audit/events?limit=50'); const L = arr(r.j && r.j.data).filter(e => JSON.stringify(e).includes(id));
return { s: r.s, err: E(r).slice(0, 200), n: L.length, ev: L.map(e => JSON.stringify(e).slice(560, 1800)) };
