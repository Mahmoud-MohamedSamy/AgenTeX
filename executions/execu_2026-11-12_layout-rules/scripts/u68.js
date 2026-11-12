async (page) => { const R = {}; const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3', lid = '3847cbd4-508c-4402-9602-e63a72a0f1d7';
  await page.setViewportSize({ width: 400, height: 860 });
  const sw = async () => page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  await page.goto(HOST + '/settings/modules-and-fields/' + mid + '?tab=layout-rules', { waitUntil: 'domcontentloaded' }); await sleep(6000); R.list = await sw(); await shot('crm-M6-list', false);
  await page.goto(HOST + '/settings/modules-and-fields/' + mid + '?tab=layout-rules', { waitUntil: 'domcontentloaded' }); await sleep(5000);
  const ed = page.locator('tr', { hasText: 'QA LR1112 basic' }).locator('button').nth(1); R.editBtnVisible = await ed.isVisible().catch(() => false); if (R.editBtnVisible) { await ed.click(); await sleep(4000); R.editor = await sw(); await shot('crm-M6-editor', false); }
  await openCreate(mid, lid); R.form = await sw(); await pick('qa_lr_type', 'Refund'); R.formRefundOrder = await vis('qa_lr_order'); await shot('crm-M6-form', false);
  await page.setViewportSize({ width: 1600, height: 900 });
  return R; }
