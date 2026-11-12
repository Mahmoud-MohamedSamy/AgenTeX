async (page, ctx) => {
  const MID = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const R = {};
  const URL = HOST + '/settings/modules-and-fields/' + MID + '?tab=validation';
  const openEdit = async (p, name) => { await p.goto(URL, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); await p.locator('tbody tr').filter({ hasText: name }).first().getByRole('button', { name: /edit/i }).first().click(); await p.waitForTimeout(2000); return p.locator('[role=dialog]').last(); };
  const p2 = await ctx.newPage();
  const d1 = await openEdit(page, 'QA VR1112 R4 pick'); const d2 = await openEdit(p2, 'QA VR1112 R4 pick');
  await d2.locator('textarea').first().fill('changed in tab 2'); await d2.getByRole('button', { name: 'Save', exact: true }).click(); await p2.waitForTimeout(3000);
  R.tab2 = await p2.locator('[role=dialog]').count();
  await d1.locator('textarea').first().fill('changed in tab 1 (stale)'); await d1.getByRole('button', { name: 'Save', exact: true }).click(); await sleep(3000);
  R.tab1Dialog = await page.locator('[role=dialog]').count();
  R.tab1Msg = (await bodyText()).match(/.{0,80}(someone else|changed by|reload|conflict|out of date).{0,100}/i)?.[0];
  await shot('crm-I1-conflict', false);
  await p2.close();
  // I2 double click Save on a new rule
  await page.goto(URL, { waitUntil: 'domcontentloaded' }); await sleep(5000);
  await page.getByRole('button', { name: /new rule/i }).first().click(); await sleep(2000);
  const d = page.locator('[role=dialog]').last(); const btn = l => d.getByRole('button', { name: l, exact: true }).first();
  await d.locator('input[type=text]').first().fill('QA VR1112 I2 double');
  await btn('Layout').click(); await sleep(800); await page.getByRole('option').filter({ hasText: 'QA VR1112 Layout' }).first().click(); await sleep(1000);
  await btn('Field to check').click(); await sleep(800); await page.getByRole('option').filter({ hasText: 'QA VR1112 dec' }).first().click(); await sleep(1500);
  const en = d.getByRole('textbox', { name: /english/i }).first(); await en.fill('QA I2');
  await btn('Save').dblclick(); await sleep(4000);
  R.I2_rows = (await page.locator('tbody tr').allInnerTexts()).filter(t => t.includes('I2 double')).length;
  return R;
}
