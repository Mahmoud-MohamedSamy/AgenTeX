async (page) => { const R = {}; const mid = '88e8ea44-1658-4df3-9930-d0902b91073d';
  await page.route('**/layout-rules**', r => r.request().method() === 'GET' ? r.abort() : r.continue());
  await page.goto(HOST + '/settings/modules-and-fields/' + mid + '?tab=layout-rules', { waitUntil: 'domcontentloaded' }); await sleep(7000); const tb = await bodyText(); const k = tb.indexOf('Layout Rules Show'); R.B9 = tb.slice(k + 200, k + 450); await shot('desk-B9'); await page.unroute('**/layout-rules**');
  await page.goto(HOST + '/settings/modules-and-fields/' + mid + '?tab=layout-rules', { waitUntil: 'domcontentloaded' }); await sleep(7000);
  const row = page.locator('tr', { hasText: 'QA LR1112 vip' }); R.rows = await row.count(); await row.first().locator('button').nth(1).click(); await sleep(5000);
  const sw = page.getByRole('switch', { name: /Help Center/ }); R.sw = await sw.count(); if (!R.sw) { R.switches = await page.getByRole('switch').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.id || '') + ':' + e.getAttribute('aria-checked'))); return R; }
  R.before = await sw.getAttribute('aria-checked'); await sw.click(); await sleep(500); R.after = await sw.getAttribute('aria-checked');
  await page.locator('main button', { hasText: /^Save$/ }).first().click(); await sleep(4000); await shot('desk-C15'); R.url = page.url().slice(-25);
  return R; }
