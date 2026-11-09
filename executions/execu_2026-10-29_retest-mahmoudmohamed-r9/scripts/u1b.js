const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', QL = 'ae624fc2-2267-4455-85ff-da5593b909ba'; const out = {};
const enc = v => ({ kind: 'string', value: String(v) });
const data = [['first_name', 'QA RT r8 u1 on SG layout'], ['phone', '01012345681'], ['single_line_3_9', 'QA AEO']].map(([f, v]) => ({ field: f, value: enc(v) }));
const a = await api('POST', `/modules/${L}/records`, { layout_id: QL, data }); out.onQaLayout = a.s + ' ' + a.t.slice(0, 220);
const b = await api('POST', `/modules/${L}/records`, { data: data.map(d => d.field === 'first_name' ? { ...d, value: enc('QA RT r8 u1 default 2') } : d) }); out.onDefault = b.s + ' ' + b.t.slice(0, 220);
return done(out);
