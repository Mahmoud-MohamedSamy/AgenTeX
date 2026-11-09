const out = {};
for (const p of ['/billing/me/summary', '/billing/usage']) { const r = await api('o', 'GET', p); out[p] = r.s + ' ' + (r.s < 300 ? r.t.replace(/[\w.+-]+@[\w.-]+/g, '<email>').slice(0, 300) : ''); }
return out;
