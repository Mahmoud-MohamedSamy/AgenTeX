async (page) => { const R = {}; const mid = '88e8ea44-1658-4df3-9930-d0902b91073d';
  await page.route('**/layout-rules*', r => r.request().method() === 'GET' ? r.abort() : r.continue());
  await page.goto(HOST + '/settings/modules-and-fields/' + mid + '?tab=layout-rules', { waitUntil: 'domcontentloaded' }); await sleep(6000); const t9 = await bodyText(); R.B9 = (t9.match(/Could not load[^.]*\.[^.]*\./) || ['none'])[0]; await page.unroute('**/layout-rules*');
  await page.goto(HOST + '/settings/modules-and-fields/' + mid + '?tab=layout-rules', { waitUntil: 'domcontentloaded' }); await sleep(6000);
  await page.getByRole('button', { name: /New Layout Rule/ }).click(); await sleep(4000);
  await page.locator('button[aria-haspopup=listbox]', { hasText: 'Choose a layout' }).click(); await sleep(800); await page.getByRole('option', { name: 'QA LR1112 Layout', exact: true }).click(); await sleep(1500);
  await page.locator('button[aria-haspopup=listbox]', { hasText: 'Choose the field' }).click(); await sleep(800); await page.getByRole('option', { name: 'QA LR1112 radio', exact: true }).first().click().catch(async () => { await page.getByRole('option', { name: 'QA LR1112 vip', exact: true }).click(); }); await sleep(1500);
  const t = await bodyText(); const i = t.indexOf('RULE NAME'); R.head = t.slice(i, i + 900);
  await page.locator('main button', { hasText: /^Show fields$/ }).first().click(); await sleep(800); R.actions = (await page.locator('[role=option]').allInnerTexts()).map(s => s.replace(/\s+/g, ' ').trim()); await shot('desk-C17', false); await page.keyboard.press('Escape');
  return R; }
