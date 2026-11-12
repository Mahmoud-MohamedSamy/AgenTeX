async (page, ctx, h) => {
  const d = await zdPage(ctx);
  const out = {};
  for (const q of ['layoutId=1475109000000439896','departmentId=1475109000000426945','status=ACTIVE','status=active','foo=bar','from=1&limit=5'])
    { const r = await zd(d, 'GET', '/validationRules?module=tickets&' + q); out[q] = r.s + ' ' + r.t.slice(0, 160); }
  const cf = await zd(d, 'POST', '/organizationFields?module=tickets', { displayLabel: 'QA VR1112 Text', type: 'Text', maxLength: 100, isMandatory: false, layoutIds: ['1475109000000439896'] });
  out.cf = cf.s + ' ' + cf.t.slice(0, 500);
  return out;
}
