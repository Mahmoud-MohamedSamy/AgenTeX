async (page) => { const R = {}; const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3', lid = '3847cbd4-508c-4402-9602-e63a72a0f1d7';
  let t = Date.now(); await page.goto(HOST + '/settings/modules-and-fields/' + mid + '?tab=layout-rules', { waitUntil: 'domcontentloaded' }); await page.waitForSelector('tr:has-text("QA LR1112 N2 39")', { timeout: 30000 }); R.listMs = Date.now() - t; R.rows = await page.locator('tbody tr').count();
  const s = page.locator('input[placeholder="Search rules"]'); t = Date.now(); await s.fill('N2 17'); await page.waitForFunction(() => document.querySelectorAll('tbody tr').length <= 2, null, { timeout: 10000 }).catch(() => {}); R.searchMs = Date.now() - t; R.rowsAfterSearch = await page.locator('tbody tr').count(); await shot('crm-N2');
  t = Date.now(); await page.goto(HOST + '/modules/' + mid + '/records/new?layout=' + lid, { waitUntil: 'domcontentloaded' }); await page.waitForSelector('[data-rule-field=qa_lr_text]', { timeout: 30000 }); R.formMs = Date.now() - t; await sleep(1500);
  await page.locator('[data-rule-field=qa_lr_radio] input[value=No]').check(); await sleep(500);
  const inp = wrap('qa_lr_text').locator('input'); t = Date.now(); await inp.pressSequentially('QA typing speed test xyz 123', { delay: 0 }); R.type28charsMs = Date.now() - t;
  t = Date.now(); await pick('qa_lr_type', 'Refund'); R.pickToEffectMs = Date.now() - t - 1500; R.orderVis = await vis('qa_lr_order');
  return R; }
