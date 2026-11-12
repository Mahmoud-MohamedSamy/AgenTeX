const mid = await modId(); const out = {};
const r0 = (await api('GET', '/modules/' + mid + '/records/' + I.G6)).j.data; out.keys = Object.keys(r0).join(','); out.layout = r0.layout_id;
// clear order while moving to Standard
const p = await api('PATCH', '/modules/' + mid + '/records/' + I.G6, { data: [{ field: 'qa_lr_order', value: { kind: 'null' } }], layout_id: I.defLayout }); out.patch = SR(p).slice(0, 300);
const p2 = await api('PUT', '/modules/' + mid + '/records/' + I.G6, { data: [{ field: 'qa_lr_order', value: { kind: 'null' } }], layout_id: I.defLayout }); out.put = SR(p2).slice(0, 300);
const r1 = (await api('GET', '/modules/' + mid + '/records/' + I.G6)).j.data; out.layoutAfter = r1.layout_id; out.order = JSON.stringify(r1.data.find(d => d.field === 'qa_lr_order'));
return out;
