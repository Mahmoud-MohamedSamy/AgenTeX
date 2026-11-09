const M = 'df656ed7-da62-4e06-b17b-bb3c83961fde', M2 = 'bb375218-6a5d-48ec-a832-fb062fd0311b';
const dts = (await call('GET', '/fields/datatypes')).j.data;
const opt = {
  address: { subfields: ['street', 'city', 'state', 'zip', 'country'] },
  auto_number: { prefix: 'QW5-', start_number: 1, padding: 4, increment: 1 },
  currency: { precision: 12, scale: 2, currency_code: 'EGP' }, decimal: { precision: 10, scale: 2 },
  formula: { expression: '1 + 1', return_kind: 'number' },
  lookup: { target_module_id: M2, related_list_title: 'QA W5 lookups' },
  multi_select_lookup: { target_module_id: M2, related_list_title: 'QA W5 multi lookups' },
  multi_select: { allowed_values: ['A', 'B', 'C'] }, pick_list: { allowed_values: ['Red', 'Green', 'Blue'] },
  radio_button: { allowed_values: ['Yes', 'No'] }, status: { allowed_values: ['Open', 'Closed'] },
  rollup_summary: { target_module_id: M2, aggregation: 'count' },
  subform: { subfields: [{ fieldName: 'qa_sub_text', labels: { en: 'Sub text' }, datatypeKey: 'single_line' }] },
  single_line: { max_length: 120 }, multi_line: { max_length: 2000 }, rich_text: { max_length: 5000 }, number: { min: 0, max: 1000 },
};
const out = {};
for (const d of dts) {
  const body = { fields: [{ fieldName: 'qa_w5_' + d.key, labels: { en: 'QA W5 ' + d.label }, datatypeKey: d.key, required: false, unique: false, ...(opt[d.key] ? { datatypeOptions: opt[d.key] } : {}) }] };
  const r = await call('POST', `/modules/${M}/fields`, body);
  out[d.key] = r.s + (r.s < 300 ? '' : ' ' + ((r.j && r.j.error && (r.j.error.code + ': ' + r.j.error.message + ' ' + JSON.stringify(r.j.error.details || '').slice(0, 150))) || r.t.slice(0, 200)));
}
const f = await call('GET', `/modules/${M}/fields`); const fl = f.j.data.fields || f.j.data;
return { results: out, fieldsNow: (fl || []).length, qaFields: (fl || []).filter(x => /^qa_w5_/.test(x.apiName || x.fieldName || '')).map(x => (x.apiName || x.fieldName) + ':' + x.datatypeKey) };
