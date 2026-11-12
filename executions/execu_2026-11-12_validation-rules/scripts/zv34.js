async (page, ctx, h) => {
  await page.keyboard.press('Escape'); await page.getByRole('button', { name: /^Cancel$/ }).last().click().catch(()=>0);
  const d = await zdPage(ctx);
  const lay = await zd(d, 'GET', '/layouts?module=tickets');
  const f = await zd(d, 'GET', '/organizationFields?module=tickets');
  const flds = (f.j?.data || []).map(x => [x.apiName, x.type, x.isCustomField ? 'C' : '', x.id].join(':'));
  const vr = await zd(d, 'GET', '/validationRules?module=tickets&layoutId=x');
  return { lay: (lay.j?.data||[]).map(l => [l.id, l.layoutName, l.departmentId, l.status].join('|')), flds: flds.join(', ').slice(0, 2500), vr: vr.s + ' ' + vr.t.slice(0, 300) };
}
