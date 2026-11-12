const r = await api('GET', '/audit/events?limit=5&entity_type=help_center'); const L = arr(D(r.j));
out.keys = Object.keys(L[0] || {}).join(','); out.ev = L.slice(0, 3).map(x => { const o = {}; for (const k of Object.keys(x)) if (/actor|user|by|source|ip|at$/i.test(k)) o[k] = typeof x[k] === 'object' ? JSON.stringify(x[k]).slice(0, 120) : x[k]; return o; });
return fin({ out });
