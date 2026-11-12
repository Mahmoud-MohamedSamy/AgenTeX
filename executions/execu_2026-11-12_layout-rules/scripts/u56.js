async (page) => { const R = {}; const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
  await page.goto(HOST + '/settings/modules-and-fields/' + mid + '?tab=layout-rules', { waitUntil: 'domcontentloaded' }); await sleep(5000);
  await page.locator('tr', { hasText: 'QA LR1112 I1 dbl' }).locator('button').nth(1).click(); await sleep(4500);
  await page.locator('button[aria-haspopup=listbox]', { hasText: 'QA LR1112 Layout' }).first().click(); await sleep(700); await page.getByRole('option', { name: 'Standard', exact: true }).click(); await sleep(2000);
  const t = await bodyText(); const i = t.indexOf('LAYOUT'); R.C9 = t.slice(i, i + 700); R.dlg = await page.locator('[role=dialog],[role=alertdialog]').count(); await shot('crm-C9');
  await page.locator('main button', { hasText: /^Save$/ }).first().click(); await sleep(3000); R.saveMsg = ((await bodyText()).match(/[^.]{0,60}(not on|no longer|could not|layout)[^.]{0,120}/gi) || []).slice(0, 4); R.url = page.url().slice(-30);
  await page.locator('main button', { hasText: /^Cancel$/ }).first().click().catch(() => {}); await sleep(1500);
  return R; }
