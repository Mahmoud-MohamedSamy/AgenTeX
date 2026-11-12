async (page) => { const R = {};
  await page.locator('main button', { hasText: /^Add action$/ }).first().click(); await sleep(800);
  const types = page.locator('main button[aria-haspopup=listbox]', { hasText: /^Show fields$/ }); R.n = await types.count(); await types.last().click(); await sleep(600); await page.getByRole('option', { name: /^Show subforms/ }).click(); await sleep(800);
  await page.locator('main button', { hasText: /^Choose…$/ }).last().click(); await sleep(700); R.subforms = (await page.locator('[role=option]').allInnerTexts()).slice(0, 10); R.sfText = ((await bodyText()).match(/[^.]{0,40}(no subform|No subforms|subforms)[^.]{0,80}/gi) || []).slice(0, 3); await page.keyboard.press('Escape'); await sleep(300);
  await page.locator('main button[aria-haspopup=listbox]', { hasText: /^Show subforms$/ }).last().click(); await sleep(600); await page.getByRole('option', { name: /^Show related lists/ }).click(); await sleep(800);
  await page.locator('main button', { hasText: /^Choose…$/ }).last().click(); await sleep(700); R.related = (await page.locator('[role=option]').allInnerTexts()).slice(0, 20); await shot('crm-F21-pick', false); await page.keyboard.press('Escape');
  return R; }
