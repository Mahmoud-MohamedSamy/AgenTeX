const M = 'df656ed7-da62-4e06-b17b-bb3c83961fde', LM = '98c36ff8-3621-411b-b373-14455f4df087', out = {}, made = {};
const tries = async (p, bodies) => { for (const b of bodies) { const r = await call('POST', `/modules/${M}/${p}`, b); if (r.s < 300) { (made[p] = made[p] || []).push(r.j.data.id); return r.s + ' ' + JSON.stringify(r.j.data).slice(0, 300); } out[p + '_err'] = (out[p + '_err'] || '') + ' || ' + r.s + ' ' + ((r.j && r.j.error && (r.j.error.message + ' ' + JSON.stringify(r.j.error.details || '').slice(0, 220))) || r.t.slice(0, 200)); } return 'all failed'; };
out.validation = await tries('validation-rules', [
  { name: 'QA W5 VR number', condition: 'qa_w5_number > 500', errorMessage: { en: 'QA W5 number must be 500 or less' }, isActive: true },
  { name: 'QA W5 VR number', condition: { expression: 'qa_w5_number > 500' }, errorMessage: { en: 'QA W5 number must be 500 or less' }, isActive: true }]);
out.layoutRule = await tries('layout-rules', [
  { name: 'QA W5 LR', triggerField: 'qa_w5_pick_list', layoutId: LM, conditions: [{ field: 'qa_w5_pick_list', operator: 'equals', value: 'Red' }], actions: [{ type: 'show', targetField: 'qa_w5_multi_line' }] }]);
out.link = await tries('links', [{ name: 'QA W5 Link', labels: { en: 'QA W5 Link' }, url: 'https://example.com/qa-w5' }]);
out.made = made; return out;
