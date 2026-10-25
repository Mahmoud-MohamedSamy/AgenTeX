const T = 'a9d87b62-b704-4c2e-b2d5-1b745d7c2065', L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const ex = {};
for (const M of [T, L]) { const r = await api('GET', `/modules/${M}/records?page=1&per_page=100`); for (const rec of arr(r.j?.data)) for (const d of (rec.data || [])) { const k = d.value?.kind; if ((k === 'object' || k === 'array') && !ex[d.field]) ex[d.field] = JSON.stringify(d.value).slice(0, 220); } }
return done(ex);
