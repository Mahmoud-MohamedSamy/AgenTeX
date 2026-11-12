async (page) => {
  const MID = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const R = {};
  await page.goto(HOST + '/settings/modules-and-fields/' + MID + '?tab=validation', { waitUntil: 'domcontentloaded' }); await sleep(5000);
  await page.getByRole('button', { name: /new rule/i }).first().click(); await sleep(2000);
  const d = page.locator('[role=dialog]').last(); const btn = l => d.getByRole('button', { name: l, exact: true }).first();
  await d.locator('input[type=text]').first().fill('QA VR1112 D5 regex ui');
  await btn('Field to check').click(); await sleep(800); await page.getByRole('option').filter({ hasText: 'QA VR1112 text' }).first().click(); await sleep(1500);
  await btn('Operator').click(); await sleep(700); await page.getByRole('option', { name: 'matches the pattern', exact: true }).click(); await sleep(1200);
  R.after = (await d.innerText()).replace(/\s+/g, ' ').match(/CHECK QA VR1112 TEXT.{0,500}/)?.[0];
  R.btns = await d.evaluate(x => [...x.querySelectorAll('button')].map(b => (b.getAttribute('aria-label') || b.innerText).trim()).filter(Boolean).slice(-15));
  await shot('crm-D5-regex', false);
  const gal = d.getByRole('button', { name: /gallery|common|example|preset|pattern library|insert/i }).first(); R.gallery = await gal.count();
  if (R.gallery) { await gal.click(); await sleep(1000); R.galleryItems = (await page.locator('[role=menuitem],[role=option],[role=listbox] *').allInnerTexts()).slice(0, 20).join('|'); await shot('crm-D5-gallery', false); await page.locator('[role=menuitem],[role=option]').first().click().catch(() => {}); await sleep(800); }
  const val = d.getByRole('textbox', { name: /pattern|value/i }).first();
  await val.fill('([a-z'); await sleep(1500); R.D6_msg = (await d.innerText()).replace(/\s+/g, ' ').match(/.{0,60}(not a valid|invalid|regular expression).{0,80}/i)?.[0];
  await shot('crm-D6-invalid', false);
  await val.fill('[A-Z]{3}-\\d{3}'); await sleep(800);
  const tester = d.getByRole('textbox', { name: /test|try/i }).first(); R.tester = await tester.count();
  if (R.tester) { await tester.fill('ABC-123'); await sleep(800); R.t1 = (await d.innerText()).replace(/\s+/g, ' ').match(/.{0,40}(match|no match|matches).{0,40}/gi)?.slice(0, 3); await tester.fill('abc'); await sleep(800); R.t2 = (await d.innerText()).replace(/\s+/g, ' ').match(/.{0,40}(match|no match|matches).{0,40}/gi)?.slice(0, 3); }
  await btn('Cancel').click(); await sleep(800);
  return R;
}
