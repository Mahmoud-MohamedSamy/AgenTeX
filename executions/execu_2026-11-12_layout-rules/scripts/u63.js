async (page) => { const R = {}; const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
  await page.goto(HOST + '/settings/modules-and-fields/' + mid + '?tab=layout-rules', { waitUntil: 'domcontentloaded' }); await sleep(5000);
  await page.locator('tr', { hasText: 'QA LR1112 I1 dbl' }).locator('button').nth(1).click(); await sleep(4500);
  await page.locator('main button', { hasText: /^Show fields$/ }).first().click(); await sleep(700); await page.getByRole('option', { name: /^Make fields mandatory/ }).first().click(); await sleep(1000);
  const ch = page.locator('main button', { hasText: /^QA LR1112 date$|^Choose…$/ }).first(); await ch.click(); await sleep(900);
  R.opts = (await page.locator('[role=option]').allInnerTexts()).map(s => s.replace(/\s+/g, ' ').trim()).filter(s => /cannot|not|Auto|Created|Modified|Owner|Full|Status/i.test(s)).slice(0, 15); R.total = await page.locator('[role=option]').count(); await shot('crm-E9', false);
  await page.keyboard.press('Escape'); await page.locator('main button', { hasText: /^Cancel$/ }).first().click().catch(() => {});
  return R; }
