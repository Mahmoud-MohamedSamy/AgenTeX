const r = await call('GET', '/modules');
return { s: r.s, n: Array.isArray(r.j.data) ? r.j.data.length : Object.keys(r.j.data || {}), first: JSON.stringify((r.j.data || [])[0]).slice(0, 900) };
