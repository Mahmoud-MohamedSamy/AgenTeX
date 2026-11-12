const r = await api('GET', '/mail/signature'); const d = r.j && r.j.data;
return done({ s: r.s, keys: d && Object.keys(d), summary: d && Object.fromEntries(Object.entries(d).map(([k, v]) => [k, typeof v === 'string' ? v.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 300) : v])) });
