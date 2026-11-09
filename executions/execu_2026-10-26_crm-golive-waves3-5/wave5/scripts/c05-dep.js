const M = 'df656ed7-da62-4e06-b17b-bb3c83961fde', LM = '98c36ff8-3621-411b-b373-14455f4df087', out = {}, ids = [];
const s = v => ({ kind: 'string', value: v }); const arr = a => ({ kind: 'array', items: a.map(s) });
for (const [pick, vals] of [['Red', ['A']], ['Red', ['C']], ['Green', ['B', 'C']], ['Green', ['A']]]) {
  const r = await call('POST', `/modules/${M}/records`, { layout_id: LM, data: [{ field: 'name', value: s('QA W5 dep ' + pick + ' ' + vals.join('')) }, { field: 'qa_w5_pick_list', value: s(pick) }, { field: 'qa_w5_multi_select', value: arr(vals) }] });
  out[pick + ' -> ' + vals.join(',')] = r.s + ' ' + (r.s < 300 ? '' : r.t.slice(0, 220)); if (r.s < 300) ids.push(r.j.data.id);
}
out.ids = ids; return out;
