const s = await call('GET', `/search?q=${encodeURIComponent('QA W2')}&limit=50`);
const me = await call('GET', '/iam/me');
return { search: s.s + ' ' + s.t.slice(0, 300), me: me.s + ' ' + me.t.slice(0, 150) };
