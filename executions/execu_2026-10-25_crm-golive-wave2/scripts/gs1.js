const out = {};
for (const q of ['QA', 'QA W2 RC', 'QA W2 tag A', 'مرحبا', '01010044232']) { const r = await call('GET', `/search?q=${encodeURIComponent(q)}&limit=20`); out[q] = r.s + ' ' + (r.s === 200 ? JSON.stringify(r.j.data).slice(0, 400) : r.t.slice(0, 200)); }
return out;
