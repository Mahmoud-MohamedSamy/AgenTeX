const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', id = '12ac3f8d-6a5e-4051-8f37-ceaaec7af2cf', TP = 'e96bf929-d1fe-45c9-8fb8-b1fcd7ca1a91';
const s = v => ({ kind: 'string', value: v });
const pv = async () => Object.fromEntries((await api('GET', `/modules/${D}/records/${id}`)).j.data.data.filter(x => /pipeline|stage/.test(x.field)).map(x => [x.field, x.value.value]));
const out = {};
let p = await api('PATCH', `/modules/${D}/records/${id}`, { data: [{ field: 'pipeline', value: s(TP) }, { field: 'stage', value: s('test-01') }] }); out.pipe_plus_common_stage = { s: p.s, err: p.j?.error?.details?.[0]?.message, now: await pv() };
p = await api('PATCH', `/modules/${D}/records/${id}`, { data: [{ field: 'pipeline', value: s(TP) }] }); out.pipe_only = { s: p.s, err: p.j?.error?.details?.[0]?.message, now: await pv() };
// any dedicated endpoint?
for (const u of [`/modules/${D}/records/${id}/pipeline`, `/modules/${D}/records/${id}/change-pipeline`]) { const r = await api('POST', u, { pipeline_id: TP, stage: 'test-01' }); out[u.split('/').pop()] = r.s + ' ' + r.t.slice(0, 200); }
return done(out);
