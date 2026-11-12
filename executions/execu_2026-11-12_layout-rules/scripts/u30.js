async (page) => { const R = {}; const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; await page.keyboard.press('Escape'); await sleep(500);
  const pickP = async (cur, txt) => { await page.getByText(cur, { exact: true }).first().click(); await sleep(700); await page.locator('[role=option], [role=menuitem], [role=menuitemradio]').filter({ hasText: txt }).first().click(); await sleep(1200); };
  const sec = async () => { const t = await bodyText(); const a = t.indexOf('QA LR1112 Sec A'); return t.slice(a, a + 160); };
  await pickP('When condition 1 matches', 'When condition 2 matches'); R.c2 = await sec(); await shot('crm-L1');
  await pickP('When condition 2 matches', 'No condition matched'); R.none = await sec();
  // L2: crm actions rule preview as profile
  await page.goto(HOST + '/settings/modules-and-fields/' + mid + '?tab=layout-rules', { waitUntil: 'domcontentloaded' }); await sleep(5000);
  await page.locator('tr', { hasText: 'QA LR1112 crm actions' }).locator('button').nth(1).click(); await sleep(5000);
  const t = await bodyText(); const i = t.indexOf('Preview'); R.actPrevOwner = t.slice(i, i + 200);
  await page.getByText('A user with no listed profile', { exact: true }).first().click(); await sleep(800); R.profOpts = (await page.locator('[role=option], [role=menuitem], [role=menuitemradio]').allInnerTexts()).slice(0, 12);
  const u = page.locator('[role=option], [role=menuitem], [role=menuitemradio]').filter({ hasText: /^User$/ }); if (await u.count()) { await u.first().click(); await sleep(1200); const t2 = await bodyText(); const j = t2.indexOf('Preview'); R.asUser = t2.slice(j, j + 1700); await shot('crm-L2'); } else await page.keyboard.press('Escape');
  return R; }
