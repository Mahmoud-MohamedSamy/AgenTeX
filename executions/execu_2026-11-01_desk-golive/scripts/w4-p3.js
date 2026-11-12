const r = await api('GET', '/modules/' + TM + '/records?limit=50&sort=-created_at');
out.other = arr(D(r.j)).map(flat).filter(t => t.email && !/mmohamed@anyware/i.test(t.email)).slice(0, 2).map(t => ({ id: t.id, n: t.ticket_number, e: String(t.email).replace(/^(.).*@/, '$1***@') }));
return fin({ out });
