const M = 'df656ed7-da62-4e06-b17b-bb3c83961fde', M2 = 'bb375218-6a5d-48ec-a832-fb062fd0311b', out = {};
// related list for rollup: a lookup on M2 pointing back at M, and a number on M2 to sum
const lk = await call('POST', `/modules/${M2}/fields`, { fields: [{ fieldName: 'qa_w5_parent', labels: { en: 'QA W5 Parent' }, datatypeKey: 'lookup', required: false, unique: false, datatypeOptions: { target_module_id: M, related_list_title: 'QA W5 children' } }, { fieldName: 'qa_w5_amount', labels: { en: 'QA W5 Amount' }, datatypeKey: 'number', required: false, unique: false }] });
out.backLookup = lk.s + ' ' + (lk.s < 300 ? '' : lk.t.slice(0, 200));
for (const [name, opts] of [['count', { target_module_id: M2, relation_field: 'qa_w5_parent', aggregation: 'count' }], ['sum', { target_module_id: M2, relation_field: 'qa_w5_parent', target_field: 'qa_w5_amount', aggregation: 'sum' }]]) {
  const r = await call('POST', `/modules/${M}/fields`, { fields: [{ fieldName: 'qa_w5_rollup_' + name, labels: { en: 'QA W5 Rollup ' + name }, datatypeKey: 'rollup_summary', required: false, unique: false, datatypeOptions: opts }] });
  out['rollup_' + name] = r.s + ' ' + (r.s < 300 ? '' : r.t.slice(0, 260));
}
const sf = await call('POST', `/modules/${M}/fields`, { fields: [{ fieldName: 'qa_w5_subform', labels: { en: 'QA W5 Subform' }, datatypeKey: 'subform', required: false, unique: false, datatypeOptions: { subfields: [{ key: 'qa_sub_text', label: 'Sub text', datatypeKey: 'single_line' }, { key: 'qa_sub_qty', label: 'Qty', datatypeKey: 'number' }] } }] });
out.subform = sf.s + ' ' + (sf.s < 300 ? '' : sf.t.slice(0, 260));
return out;
