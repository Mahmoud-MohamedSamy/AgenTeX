async (page, ctx) => {
  const p = await zdPage(ctx); const L = '1475109000000439896'; const out = [];
  const b = { name: 'QA LR1112 zd text primary', description: 'qa', fieldName: 'subject', fieldConditions: [{ pattern: '1', conditions: [{ fieldName: 'subject', condition: 'is', value: ['QA'] }], actions: { showFields: [{ fieldName: 'phone' }] } }] };
  const r = await zd(p, 'POST', '/layouts/' + L + '/layoutRules', b); out.push(r.s + ' ' + r.t.slice(0, 600));
  return out;
}
