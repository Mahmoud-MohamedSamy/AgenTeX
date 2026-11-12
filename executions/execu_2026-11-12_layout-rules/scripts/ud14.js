async (page) => { const R = {}; const mid = '88e8ea44-1658-4df3-9930-d0902b91073d';
  await page.locator('main button', { hasText: /^Cancel$/ }).first().click().catch(() => {}); await sleep(1000);
  await page.route('**/layout-rules*', r => r.request().method() === 'GET' ? r.abort() : r.continue());
  await page.goto(HOST + '/settings/modules-and-fields/' + mid + '?tab=layout-rules', { waitUntil: 'domcontentloaded' }); await sleep(6000); R.B9 = ((await bodyText()).match(/Could not load[^.]*\.[^.]*\./) || ['none'])[0]; await shot('desk-B9'); await page.unroute('**/layout-rules*');
  await page.goto(HOST + '/settings/modules-and-fields/' + mid + '?tab=layout-rules', { waitUntil: 'domcontentloaded' }); await sleep(6000);
  await page.locator('tr', { hasText: 'QA LR1112 vip' }).locator('button').nth(1).click(); await sleep(4500);
  const hc = page.locator('main button', { hasText: 'Apply to Help Center' }).first(); R.hcRole = await hc.getAttribute('role'); R.hcBefore = await hc.getAttribute('aria-checked') || await hc.getAttribute('aria-pressed') || await hc.getAttribute('data-state');
  await hc.click(); await sleep(600); R.hcAfter = await hc.getAttribute('aria-checked') || await hc.getAttribute('aria-pressed') || await hc.getAttribute('data-state');
  await page.locator('main button', { hasText: /^Save$/ }).first().click(); await sleep(4000); R.url = page.url().slice(-25); await shot('desk-C15');
  return R; }
