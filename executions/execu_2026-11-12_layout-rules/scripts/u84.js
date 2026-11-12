async (page, ctx) => { const R = {}; const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
  await page.goto(HOST + '/settings/modules-and-fields/' + mid + '?tab=layout-rules', { waitUntil: 'domcontentloaded' }); await sleep(5000);
  await page.locator('tr', { hasText: 'QA LR1112 I1 dbl' }).locator('button').nth(1).click(); await sleep(4500);
  await page.locator('textarea').first().fill('I9 unsaved work');
  await page.route('**/api/v1/**', r => r.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ success: false, error: { code: 'TOKEN_EXPIRED', message: 'Token expired' } }) }));
  await page.locator('main button', { hasText: /^Save$/ }).first().click(); await sleep(5000);
  R.url = page.url().slice(-60); R.msg = ((await bodyText()).match(/[^.]{0,60}(sign in|session|expired|could not be saved|Sign in)[^.]{0,100}/gi) || []).slice(0, 3); R.descStill = await page.locator('textarea').first().inputValue().catch(() => 'gone'); await shot('crm-I9');
  await page.unroute('**/api/v1/**'); return R; }
