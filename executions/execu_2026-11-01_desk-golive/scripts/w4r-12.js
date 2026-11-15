const ul = arr(D((await api('GET', '/iam/users?limit=200')).j)); const b = ul.find(u => /^mahmoud\.mahamed1515@/.test(u.email || '')); out.b = !!b;
if (b) { const r = await api('POST', '/desk/tickets/f642b146-8c00-4e6e-8b89-82bb5def710d/assign', { owner_id: b.userId }); out.assign = r.s + ' ' + r.t.slice(0, 160); }
return fin({ out });
