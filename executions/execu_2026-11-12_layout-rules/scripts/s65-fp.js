const mid = await modId(); const r = await api('GET', '/modules/' + mid + '/field-permissions'); return { s: r.s, body: JSON.stringify(r.j).slice(0, 1500) };
