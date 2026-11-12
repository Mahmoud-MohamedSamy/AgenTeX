async (page) => { const R = {};
  await page.locator('main button', { hasText: /^Choose…$/ }).last().click(); await sleep(700); await page.getByRole('option', { name: 'Customers (Lookup)', exact: true }).first().click(); await sleep(500); await page.keyboard.press('Escape'); await sleep(300);
  await page.locator('main button', { hasText: /^Save$/ }).first().click(); await sleep(4000); R.url = page.url().slice(-25); R.msg = ((await bodyText()).match(/could not be saved[^.]*\.[^.]*/i) || [''])[0];
  return R; }
