const id = '1499272000000492011'; out.t = [];
for (const [m, p, b] of [['POST', 'teams/' + id + '/delete', {}], ['POST', 'teams/deleteTeams', { teamIds: [id] }], ['POST', 'teams/' + id + '/move', {}]]) { const r = await api(page, m, p, b); out.t.push(m + ' ' + p + ' ' + r.s + ' ' + r.t.slice(0, 120)); if (r.s < 300) break; }
out.get = (await api(page, 'GET', 'teams/' + id)).s;
