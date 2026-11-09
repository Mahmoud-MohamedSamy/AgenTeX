const M = 'df656ed7-da62-4e06-b17b-bb3c83961fde', LM = '98c36ff8-3621-411b-b373-14455f4df087', out = {}, ids = [];
const s = v => ({ kind: 'string', value: v }), n = v => ({ kind: 'number', value: v });
const mk = async (name, extra) => { const r = await call('POST', `/modules/${M}/records`, { layout_id: LM, data: [{ field: 'name', value: s(name) }, { field: 'qa_w5_pick_list', value: s('Red') }, ...extra] }); if (r.s < 300) ids.push(r.j.data.id); return r.s + ' ' + (r.s < 300 ? '' : r.t.slice(0, 260)); };
out.vrOver = await mk('QA W5 VR 600', [{ field: 'qa_w5_number', value: n(600) }]);
out.vrUnder = await mk('QA W5 VR 100', [{ field: 'qa_w5_number', value: n(100) }]);
out.depAllowed = await mk('QA W5 dep A', [{ field: 'qa_w5_multi_select', value: { kind: 'string_list', value: ['A'] } }]);
out.depNotAllowed = await mk('QA W5 dep C', [{ field: 'qa_w5_multi_select', value: { kind: 'string_list', value: ['C'] } }]);
out.depNotAllowed2 = await mk('QA W5 dep C2', [{ field: 'qa_w5_multi_select', value: s('C') }]);
out.ids = ids; return out;
