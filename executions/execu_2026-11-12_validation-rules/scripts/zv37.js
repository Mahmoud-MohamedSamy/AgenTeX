async (page, ctx, h) => {
  const d = await zdPage(ctx);
  const out = {};
  const L = '1475109000000439896';
  const tries = [
    { name: 'QA VR1112 DR1', module: 'tickets', layoutId: L, fieldId: '1475109000000528009', criteria: { fieldConditions: [{ fieldName: 'cf_qa_vr1112_text', condition: 'starts with', value: ['BAD'] }], pattern: '1' }, errorMessage: 'QA VR1112 starts with BAD' },
    {},
  ];
  for (let i=0;i<tries.length;i++){ const r = await zd(d, 'POST', '/validationRules?module=tickets', tries[i]); out['t'+i] = r.s + ' ' + r.t.slice(0, 400); if (r.s<300) break; }
  return out;
}
