const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
const ids = ['8e8227b2-a494-47e3-a368-4e2880e49c39', '2f41b135-71ad-42ad-be80-1674a0d50169'];
// find the mass update endpoint used by the UI: try likely shapes
const out = {};
for (const [u, b] of [[`/modules/${D}/records/mass-update`, { ids, data: [{ field: 'probability', value: { kind: 'number', value: 50 } }] }], [`/modules/${D}/records/bulk-update`, { record_ids: ids, data: [{ field: 'probability', value: { kind: 'number', value: 50 } }] }]]) { const r = await api('POST', u, b); out[u.split('/').pop()] = r.s + ' ' + r.t.slice(0, 300); }
const single = await api('PATCH', `/modules/${D}/records/${ids[0]}`, { data: [{ field: 'probability', value: { kind: 'number', value: 50 } }, { field: 'expected_revenue', value: { kind: 'number', value: 5000 } }] });
out.singlePatch = single.s + ' ' + single.t.slice(0, 300);
out.now = Object.fromEntries((await api('GET', `/modules/${D}/records/${ids[0]}`)).j.data.data.filter(x => /prob|expected|stage/.test(x.field)).map(x => [x.field, x.value.value]));
return done(out);
