async (page) => { const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3', lid = '3847cbd4-508c-4402-9602-e63a72a0f1d7'; const R = {};
  await openCreate(mid, lid); await page.locator('[data-rule-field=qa_lr_radio] input[value=No]').check(); await sleep(1200);
  R.start = await vis('qa_lr_reason'); await typeIn('qa_lr_email2','qa@example.com'); R.filled = await vis('qa_lr_reason');
  await typeIn('qa_lr_email2',''); R.cleared = await vis('qa_lr_reason'); await shot('crm-D6');
  return R; }
