const r = await api('GET', '/desk/happiness/settings'); return { s: r.s, body: r.t.replace(/[\w.+-]+@[\w.-]+/g, '<email>').slice(0, 1500) };
