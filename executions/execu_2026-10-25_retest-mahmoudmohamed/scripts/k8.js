const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', C = '6f553963-01d6-4b68-9fb3-143d23044c41', LAYOUT = '563411f4-6c8e-4b98-a91d-c618d88a5138';
const X = 'f7b82386-15d7-4950-9d45-05e9dca09e43', Y = '25b10f22-8ec2-4391-a6d8-9ff9770e8a80';
const s = v => ({ kind: 'string', value: v }); const a = vs => ({ kind: 'array', items: vs.map(s) });
const mk = async (n, lk, ms) => { const data = [{ field: 'first_name', value: s(n) }, { field: 'single_line_3_9', value: s('QA RT') }]; if (lk) data.push({ field: 'lookup_3_9', value: s(lk) }); if (ms) data.push({ field: 'multi_select_lookup_8_9', value: a(ms) }); const r = await api('POST', `/modules/${L}/records`, { data, layout_id: LAYOUT }); return n + ' ' + r.s + ' ' + (r.j?.data?.id || r.t.slice(0, 250)); };
const out = [];
out.push(await mk('QA RT 2101 Q1', `${C}:${X}`, [`${C}:${X}`]));
if (/ 20\d /.test(out[0])) { out.push(await mk('QA RT 2101 Q2', `${C}:${X}`, [`${C}:${X}`, `${C}:${Y}`])); out.push(await mk('QA RT 2101 Q3', `${C}:${Y}`, [`${C}:${Y}`])); out.push(await mk('QA RT 2101 Q4', null, null)); }
return done(out);
