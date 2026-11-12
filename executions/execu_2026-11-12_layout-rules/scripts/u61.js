async (page) => { const R = {}; const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3', lid = '3847cbd4-508c-4402-9602-e63a72a0f1d7';
  await openCreate(mid, lid); R.formOpens = await page.locator('[data-rule-field]').count(); await pick('qa_lr_type', 'Refund'); R.refundOrderReq = await isReq('qa_lr_order'); R.refundOrderVis = await vis('qa_lr_order'); await pick('qa_lr_tier', 'Bronze'); await pick('qa_lr_type', 'Other'); R.bronzeOrderReqHidden = await isReq('qa_lr_order'); await shot('crm-J6');
  return R; }
