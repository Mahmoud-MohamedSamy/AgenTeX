async (page) => { const R = {}; const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
  await page.getByRole('button', { name: /^Actions$/ }).first().click(); await sleep(1000); R.menu = await page.locator('[role=menuitem]').allInnerTexts();
  const c = page.locator('[role=menuitem]', { hasText: /Clone/i }); if (await c.count()) { await c.first().click(); await sleep(6000); R.url = page.url(); R.type = await valOf('qa_lr_type'); R.orderVis = await vis('qa_lr_order'); R.orderReq = await isReq('qa_lr_order'); R.orderVal = await valOf('qa_lr_order'); await shot('crm-G6'); }
  return R; }
