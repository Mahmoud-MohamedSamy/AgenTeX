const TK = 'e8e5e302-3873-4e32-b945-c9cd25c7659d'; const m = JSON.parse(fs.readFileSync('../a6/bugs1-made.json')); const R = { t: [], b: [] };
for (const t of m.tickets) R.t.push((await api('DELETE', `/modules/${TK}/records/${t}`)).s);
for (const b of m.bps) { await api('POST', `/desk/blueprints/${b}/revoke`, { ticket_ids: null, after: null }); R.b.push((await api('DELETE', `/modules/${TK}/blueprints/${b}`)).s); }
log(JSON.stringify(R));
