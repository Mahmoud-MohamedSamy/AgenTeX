async (page) => { const R = {}; const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
  await page.goto(HOST + '/settings/modules-and-fields/' + mid + '?tab=layout-rules', { waitUntil: 'domcontentloaded' }); await sleep(5000);
  await page.locator('tr', { hasText: 'QA LR1112 basic' }).locator('button').nth(1).click(); await sleep(4500);
  await page.locator('main button', { hasText: /^Add action$/ }).last().click(); await sleep(800);
  const types = page.locator('main button[aria-haspopup=listbox]', { hasText: /^Show fields$/ }); await types.last().click(); await sleep(600); await page.getByRole('option', { name: /^Show related lists/ }).click(); await sleep(800);
  await page.locator('main button', { hasText: /^Choose…$/ }).last().click(); await sleep(700); await page.getByRole('option', { name: 'Customers (Lookup)', exact: true }).first().click(); await sleep(600); await page.keyboard.press('Escape'); await sleep(400);
  const t = await bodyText(); const i = t.indexOf('RELATED LISTS TO SHOW'); R.sel = t.slice(i, i + 120); await shot('crm-F21-editor');
  await page.locator('main button', { hasText: /^Save$/ }).first().click(); await sleep(4000); R.url = page.url().slice(-25); R.after = ((await bodyText()).match(/(could not be saved|Fix the|saved)[^.]{0,150}/i) || [''])[0];
  return R; }
