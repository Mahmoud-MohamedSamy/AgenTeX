const t0=Date.now(); const r = await api('GET', '/iam/me'); return done({ s: r.s, ms: Date.now()-t0 });
