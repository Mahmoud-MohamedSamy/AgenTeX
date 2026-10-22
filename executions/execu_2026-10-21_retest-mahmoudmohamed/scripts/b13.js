const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
const s = v => ({ kind: 'string', value: v });
const recs = arr((await api('GET', `/modules/${D}/records?page=1&per_page=200`)).j.data);
const r = recs.find(x => (x.data.find(f => f.field === 'pipeline') || {}).value?.value === 'e96bf929-d1fe-45c9-8fb8-b1fcd7ca1a91');
const pv = async () => Object.fromEntries((await api('GET', `/modules/${D}/records/${r.id}`)).j.data.data.filter(x => /pipeline|stage|deal_name|name$/.test(x.field)).map(x => [x.field, x.value.value]));
const before = await pv(); const out = { id: r.id, before };
const other = before.stage === 'test-02' ? 'test-01' : 'test-02';
let p = await api('PATCH', `/modules/${D}/records/${r.id}`, { data: [{ field: 'stage', value: s(other) }] }); out.to_other = { s: p.s, err: p.j?.error?.details?.[0]?.message, now: await pv() };
p = await api('PATCH', `/modules/${D}/records/${r.id}`, { data: [{ field: 'stage', value: s('qualification') }] }); out.outside = { s: p.s, err: p.j?.error?.details?.[0]?.message, now: await pv() };
if (before.stage) { p = await api('PATCH', `/modules/${D}/records/${r.id}`, { data: [{ field: 'stage', value: s(before.stage) }] }); out.restore = { s: p.s, now: await pv() }; }
return done(out);
