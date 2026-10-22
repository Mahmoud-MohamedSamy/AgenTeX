const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
const ids = ['8e8227b2-a494-47e3-a368-4e2880e49c39', '2f41b135-71ad-42ad-be80-1674a0d50169'];
const r1 = await api('POST', `/modules/${D}/records/mass-update`, { record_ids: ids, data: [{ field: 'probability', value: { kind: 'number', value: 50 } }] });
const r2 = await api('POST', `/modules/${D}/records/mass-update`, { record_ids: ids, data: [{ field: 'expected_revenue', value: { kind: 'number', value: 5000 } }] });
const r3 = await api('POST', `/modules/${D}/records/mass-update`, { record_ids: ids, data: [{ field: 'next_step', value: { kind: 'string', value: 'QA RT 1314 control' } }] });
const now = {}; for (const id of ids) now[id] = Object.fromEntries((await api('GET', `/modules/${D}/records/${id}`)).j.data.data.filter(x => /prob|expected|next_step/.test(x.field)).map(x => [x.field, x.value.value]));
return done({ prob: r1.s + ' ' + r1.t.slice(0, 400), rev: r2.s + ' ' + r2.t.slice(0, 400), control: r3.s + ' ' + r3.t.slice(0, 200), now });
