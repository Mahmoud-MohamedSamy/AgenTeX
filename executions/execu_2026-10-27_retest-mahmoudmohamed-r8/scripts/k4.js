// Read pipeline "1" full id and try to widen the custom 'pipeline' pick list (restored by k6.js).
const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', F = '6b44c7c9-5c6b-4e7f-a33a-5fdbc43ec0ab';
const P1 = arr((await api('GET', `/modules/${D}/pipelines?layout_id=fcba0068-d67f-44f5-8412-cdef9c09e16e`)).j?.data).find(p => p.name === '1')?.id;
const STD = '5170500c-b335-479c-96d1-ed138965c345';
const body = { datatypeOptions: { allowed_values: ['Standard (Standard)', P1, STD] }, rowVersion: 1 };
const out = { P1 };
for (const [m, p] of [['PATCH', `/modules/${D}/fields/${F}`], ['PUT', `/modules/${D}/fields/${F}`]]) { const r = await api(m, p, body); out[m] = r.s + ' ' + r.t.slice(0, 200); if (r.s < 300) break; }
const f = arr((await api('GET', `/modules/${D}/fields`)).j?.data).find(x => x.id === F); out.now = f?.datatypeOptions;
return done(out);
