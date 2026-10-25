const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', B = 'dbd0c426-8f33-4726-b74f-44d44b396b65';
const r = (await api('GET', `/modules/${D}/records/${B}`)).j?.data; const g = Object.fromEntries((r?.data || []).filter(d => /stage|closing|amount|reason/.test(d.field)).map(d => [d.field, d.value?.value ?? d.value?.kind]));
await shot('2113-00-now');
const t = await txt(); return done({ b: g, inText: t.includes('QA RT 2113 b'), modified: r?.last_modified_at });
