const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', LAY = 'bf971461-2edc-45f2-b6e4-6e180aa64288';
const s = (k, v) => ({ field: k, value: { kind: 'string', value: v } });
out.ids = [];
for (let i = 1; i <= 8; i++) { const n = 'QA R2SC MD ' + i; const r = await api('POST', `/modules/${L}/records`, { layout_id: LAY, data: [s('name', n), s('first_name', n), s('phone', '0101000000' + i), s('single_line_3_9', 'QA R2SC')] }); out.ids.push(r.s === 201 ? r.j.data.id : 'ERR ' + r.s); }
// API: bulk delete two by selection
const sel = out.ids.slice(0, 2);
const d = await api('DELETE', `/modules/${L}/records/bulk?ids=${sel.join(',')}`); out.bulk = { s: d.s, t: d.t.slice(0, 300) };
out.afterBulk = await Promise.all(sel.map(async id => (await api('GET', `/modules/${L}/records/${id}`)).s));
// bulk with a non-existing id mixed in
const d2 = await api('DELETE', `/modules/${L}/records/bulk?ids=${out.ids[2]},00000000-0000-4000-8000-000000000009`); out.bulkMixed = { s: d2.s, t: d2.t.slice(0, 300) };
out.active = (await api('GET', `/modules/${L}/mass-delete-jobs/active`)).t.slice(0, 300);
