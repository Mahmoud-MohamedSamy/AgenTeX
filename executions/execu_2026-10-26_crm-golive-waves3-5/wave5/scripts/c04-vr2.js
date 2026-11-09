const M = 'df656ed7-da62-4e06-b17b-bb3c83961fde', LM = '98c36ff8-3621-411b-b373-14455f4df087', out = {}, ids = [], rules = [];
const s = v => ({ kind: 'string', value: v }), n = v => ({ kind: 'number', value: v });
out.rule = (await call('GET', `/modules/${M}/validation-rules`)).t.slice(0, 600);
for (const cond of ['${qa_w5_number} > 500', 'record.qa_w5_number > 500', 'qa_w5_number >= 500', 'garbage ((( not an expression']) {
  const r = await call('POST', `/modules/${M}/validation-rules`, { name: 'QA W5 VR ' + cond.slice(0, 20), condition: cond, errorMessage: { en: 'QA W5 VR blocked: ' + cond } }); out['create ' + cond] = r.s + ' ' + (r.s < 300 ? '' : r.t.slice(0, 200)); if (r.s < 300) rules.push(r.j.data.id);
}
const r6 = await call('POST', `/modules/${M}/records`, { layout_id: LM, data: [{ field: 'name', value: s('QA W5 VR 700') }, { field: 'qa_w5_pick_list', value: s('Red') }, { field: 'qa_w5_number', value: n(700) }] }); out.save700 = r6.s + ' ' + (r6.s < 300 ? '' : r6.t.slice(0, 300)); if (r6.s < 300) ids.push(r6.j.data.id);
for (const kind of ['string_array', 'list', 'array', 'multi_select', 'strings']) { const r = await call('POST', `/modules/${M}/records`, { layout_id: LM, data: [{ field: 'name', value: s('QA W5 ms ' + kind) }, { field: 'qa_w5_pick_list', value: s('Red') }, { field: 'qa_w5_multi_select', value: { kind, value: ['C'] } }] }); out['ms ' + kind] = r.s + ' ' + r.t.slice(0, 160); if (r.s < 300) { ids.push(r.j.data.id); break; } }
out.ids = ids; out.rules = rules; return out;
