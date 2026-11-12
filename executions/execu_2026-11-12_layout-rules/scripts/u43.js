async (page) => { const R = {}; const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
  await page.goto(HOST + '/modules/' + mid + '/records?search=QA%20LR1112', { waitUntil: 'domcontentloaded' }); await sleep(7000);
  const s = page.locator('input[placeholder*=Search i]').last(); if (await s.count()) { await s.fill('QA LR1112 rec G4'); await page.keyboard.press('Enter'); await sleep(4000); }
  const row = page.locator('tr', { hasText: 'QA LR1112' }).first(); R.row = (await row.innerText().catch(() => 'none')).slice(0, 150);
  await row.getByRole('button', { name: 'Row actions' }).click(); await sleep(800); await page.locator('[role=menuitem]', { hasText: 'Clone' }).click(); await sleep(6000);
  R.url = page.url(); R.type = await valOf('qa_lr_type'); R.orderVis = await vis('qa_lr_order'); R.orderReq = await isReq('qa_lr_order'); R.layoutTxt = (await bodyText()).slice(0, 0); await shot('crm-G6');
  return R; }
