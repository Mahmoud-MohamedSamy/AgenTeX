const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', R = '8e8227b2-a494-47e3-a368-4e2880e49c39';
const r = await api('GET', `/modules/${D}/records/${R}`);
const d = r.j.data; const pick = {}; const flat = JSON.stringify(d);
return done({ s: r.s, keys: Object.keys(d), raw: flat.slice(0, 2500) });
