const M = 'df656ed7-da62-4e06-b17b-bb3c83961fde', LM = '98c36ff8-3621-411b-b373-14455f4df087', out = {}, made = {};
const fl = (await call('GET', `/modules/${M}/fields`)).j.data; const F = k => (fl.fields || fl).find(x => x.apiName === k);
const tries = async (p, bodies) => { for (const b of bodies) { const r = await call('POST', `/modules/${M}/${p}`, b); if (r.s < 300) { (made[p] = made[p] || []).push(r.j.data.id); return r.s + ' ' + JSON.stringify(b).slice(0, 160); } out[p + '_err'] = (out[p + '_err'] || '') + ' || ' + r.s + ' ' + ((r.j && r.j.error && (r.j.error.message + ' ' + JSON.stringify(r.j.error.details || '').slice(0, 220))) || r.t.slice(0, 200)); } return 'all failed'; };
out.validation = await tries('validation-rules', [
  { name: 'QA W5 VR number', condition: 'qa_w5_number > 500', errorMessage: 'QA W5 number must be 500 or less', isActive: true },
  { name: 'QA W5 VR number', condition: { field: 'qa_w5_number', operator: 'greater_than', value: 500 }, errorMessages: { en: 'QA W5 number must be 500 or less' }, isActive: true },
  { name: 'QA W5 VR number', condition: { kind: 'NumberCompare', field: 'qa_w5_number', operator: 'GreaterThan', numberValue: 500 }, errorMessage: { en: 'QA W5 number must be 500 or less' } }]);
out.layoutRule = await tries('layout-rules', [
  { name: 'QA W5 LR', triggerField: 'qa_w5_pick_list', layoutId: LM, conditions: [{ operator: 'equals', value: 'Red' }], actions: [{ type: 'show', fields: ['qa_w5_multi_line'] }] },
  { name: 'QA W5 LR', triggerField: F('qa_w5_pick_list').id, layoutId: LM, condition: { operator: 'equals', value: 'Red' }, actions: [{ type: 'set_mandatory', fieldId: F('qa_w5_multi_line').id }] }]);
out.dependency = await tries('dependency-maps', [{ controllingFieldId: F('qa_w5_pick_list').id, dependentFieldId: F('qa_w5_multi_select').id, valueMap: { Red: ['A'], Green: ['B', 'C'], Blue: ['A', 'B', 'C'] } }]);
out.button = await tries('buttons', [{ name: 'QA W5 Button', label: 'QA W5 Button', actionType: 'url', actionTarget: 'https://example.com/qa-w5', location: 'detail' }, { name: 'QA W5 Button', labels: { en: 'QA W5 Button' }, actionType: 'Url', actionTarget: 'https://example.com/qa-w5', placement: 'Detail' }]);
out.link = await tries('links', [{ name: 'QA W5 Link', label: 'QA W5 Link', url: 'https://example.com/qa-w5?id=${id}' }]);
out.made = made; return out;
