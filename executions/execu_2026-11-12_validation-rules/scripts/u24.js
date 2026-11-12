async (page) => {
  const MID = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const R = {};
  await page.goto(HOST + '/settings/modules-and-fields/' + MID + '?tab=validation', { waitUntil: 'domcontentloaded' }); await sleep(5000);
  await page.getByRole('button', { name: /new rule/i }).first().click(); await sleep(2000);
  const d = page.locator('[role=dialog]').last(); const btn = l => d.getByRole('button', { name: l, exact: true }).first();
  await btn('Field to check').click(); await sleep(700); await page.getByRole('option').filter({ hasText: 'QA VR1112 email' }).first().click(); await sleep(1200);
  await d.getByText('Function', { exact: true }).first().click(); await sleep(1500);
  R.F = (await d.innerText()).replace(/\s+/g, ' ').match(/RULE TYPE.{0,900}/)?.[0];
  R.btns = await d.evaluate(x => [...x.querySelectorAll('button,input')].map(b => (b.getAttribute('aria-label') || b.innerText || b.placeholder || b.type).trim()).filter(Boolean));
  const url = d.getByRole('textbox', { name: /url|address/i }).first(); if (await url.count()) { await url.fill('http://not-https.example'); await sleep(800); R.F2_ui = (await d.innerText()).replace(/\s+/g, ' ').match(/.{0,40}https.{0,80}/gi)?.slice(0, 3); }
  await shot('crm-F5-function', false);
  const t = d.getByRole('button', { name: /test/i }).first(); R.testBtn = await t.count(); R.testBtnDisabled = R.testBtn ? await t.isDisabled() : null;
  await btn('Cancel').click(); return R;
}
