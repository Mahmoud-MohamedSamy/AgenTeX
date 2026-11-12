async (page) => { const R = {}; const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
  await page.goto(HOST + '/settings/modules-and-fields/' + mid + '?tab=layout-rules', { waitUntil: 'domcontentloaded' }); await sleep(5000);
  await page.locator('tr', { hasText: 'QA LR1112 basic' }).locator('button').nth(1).click(); await sleep(4500);
  // F1 + F21: action list
  await page.locator('main button', { hasText: /^Show fields$/ }).first().click(); await sleep(700); R.actions = (await page.locator('[role=option]').allInnerTexts()).map(s => s.replace(/\s+/g, ' ').trim()); await page.keyboard.press('Escape'); await sleep(300);
  return R; }
