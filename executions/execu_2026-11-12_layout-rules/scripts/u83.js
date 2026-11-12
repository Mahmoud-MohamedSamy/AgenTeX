async (page) => { const R = {}; const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3', lid = '3847cbd4-508c-4402-9602-e63a72a0f1d7';
  await openCreate(mid, lid); await wrap('lead_source').locator('button[role=combobox]').first().click(); await sleep(700); R.opts = (await page.getByRole('option').allInnerTexts()).slice(-5); await page.getByRole('option', { name: /^chat$/i }).first().click(); await sleep(1200);
  R.orderVis = await vis('qa_lr_order'); R.orderReq = await isReq('qa_lr_order'); R.msg = (await bodyText()).includes('QA X3 partner lead');
  await wrap('qa_lr_tier').locator('button[role=combobox]').first().click(); await sleep(700); R.tierOpts = (await page.getByRole('option').allInnerTexts()).slice(-4); await page.keyboard.press('Escape');
  await typeIn('first_name', 'QA LR1112 rec X3'); await page.getByRole('button', { name: /^Save$/ }).last().click(); await sleep(3000); R.blockedNoOrder = /records\/new/.test(page.url());
  await typeIn('qa_lr_order', 'ORD-X3'); await page.getByRole('button', { name: /^Save$/ }).last().click(); await sleep(3000); R.verifyPopup = await page.getByText('Verify these values').count();
  if (R.verifyPopup) { await page.getByRole('button', { name: /^Continue$/ }).click(); await sleep(4000); } R.saved = !/records\/new/.test(page.url()); R.recUrl = page.url().slice(-36); await shot('crm-X3');
  // edit page: same effects
  if (R.saved) { await page.getByRole('button', { name: /^Edit$/ }).first().click(); await sleep(5000); R.editOrderReq = await isReq('qa_lr_order'); R.editMsg = (await bodyText()).includes('QA X3 partner lead'); }
  return R; }
