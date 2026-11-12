async (page) => { const R = {};
  await page.locator('main button[aria-haspopup=listbox]').first().click(); await sleep(800); await page.getByRole('option', { name: 'QA LR1112 Layout', exact: true }).click(); await sleep(1500);
  await page.locator('button[aria-haspopup=listbox]', { hasText: 'Choose the field' }).click(); await sleep(800); R.pf = (await page.getByRole('option').allInnerTexts()).map(s => s.replace(/\s+/g, ' ')); await page.getByRole('option', { name: 'QA LR1112 tier', exact: true }).click(); await sleep(1500);
  await page.locator('main button', { hasText: /^Show fields$/ }).first().click(); await sleep(800); R.actions = (await page.locator('[role=option]').allInnerTexts()).map(s => s.replace(/\s+/g, ' ').trim()); await shot('desk-C17', false); await page.keyboard.press('Escape'); await sleep(400);
  await page.locator('main button', { hasText: /^All departments$/ }).click(); await sleep(800); R.depts = (await page.locator('[role=option]').allInnerTexts()).map(s => s.trim()); await page.keyboard.press('Escape');
  return R; }
