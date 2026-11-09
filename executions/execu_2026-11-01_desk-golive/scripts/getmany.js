const out = {};
for (const p of __PATHS__) { try { const r = await api('GET', p); out[p] = { s: r.s, j: r.j }; } catch (e) { out[p] = { s: 'ERR', e: String(e.message).slice(0, 80) }; } }
return done(out);
