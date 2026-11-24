const r = await api('GET', '/agents/tia/conversations'); const L = arr(r.j?.data);
return { tenant: process.env.TENANT || 'default 0004', n: L.length, first3: L.slice(0, 3).map(c => c.id.slice(0, 8) + ' ' + (c.title || '').slice(0, 30)) };
