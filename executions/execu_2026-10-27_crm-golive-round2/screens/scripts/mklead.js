const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', LAY = 'bf971461-2edc-45f2-b6e4-6e180aa64288';
const s = (k, v) => ({ field: k, value: { kind: 'string', value: v } });
const name = 'QA R2SC Perf lead';
const r = await api('POST', `/modules/${L}/records`, { layout_id: LAY, data: [s('name', name), s('first_name', name), s('phone', '01012345678'), s('single_line_3_9', 'QA R2SC')] });
out.s = r.s; out.id = r.j && r.j.data && r.j.data.id; out.t = r.s >= 300 ? r.t : '';
