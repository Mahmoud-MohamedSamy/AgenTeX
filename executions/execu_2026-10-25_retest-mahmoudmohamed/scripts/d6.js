const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', A = '95503f26-c7b3-4564-91a1-aca6b497fb1a';
const get = async () => { const r = (await api('GET', `/modules/${D}/records/${A}`)).j?.data; return Object.fromEntries((r?.data || []).filter(d => /stage|pipeline/.test(d.field)).map(d => [d.field, d.value?.value ?? d.value])); };
const before = await get();
let p = await api('PATCH', `/modules/${D}/records/${A}`, { data: [{ field: 'stage', value: { kind: 'null' } }] });
const r1 = p.s + ' ' + (p.s >= 300 ? p.t.slice(0, 200) : '');
const after = await get();
return done({ before, r1, after });
