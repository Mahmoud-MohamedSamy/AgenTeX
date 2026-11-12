async (page) => { const R = {}; const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3', lid = '3847cbd4-508c-4402-9602-e63a72a0f1d7';
  await page.goto(HOST + '/modules/' + mid + '/records/new?clone_from=0abf46ab-9372-4b26-a1e3-9c0634903cb7&layout=' + lid + '&clone_subforms=1&clone_tags=1', { waitUntil: 'domcontentloaded' }); await page.waitForSelector('[data-rule-field]', { timeout: 30000 }).catch(() => {}); await sleep(5000);
  R.secBLoad = await vis('qa_lr_reason'); R.secTitle = await secVis('QA LR1112 Sec B'); await shot('crm-G6');
  await pick('qa_lr_type', 'Refund'); R.refundOrder = await vis('qa_lr_order'); await pick('qa_lr_type', 'Question'); R.secBAfterRepick = await vis('qa_lr_reason');
  await openCreate(mid, lid); await pick('qa_lr_type', 'Question'); R.createSecB = await vis('qa_lr_reason');
  return R; }
