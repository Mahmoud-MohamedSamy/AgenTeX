async (page) => { const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3', lid = '3847cbd4-508c-4402-9602-e63a72a0f1d7'; const R = {};
  await openCreate(mid, lid); R.orderVis = await vis('qa_lr_order'); R.orderReq = await isReq('qa_lr_order');
  await typeIn('first_name', 'QA LR1112 rec E7'); await page.getByRole('button', { name: /^Save$/ }).last().click(); await sleep(4000);
  R.url = page.url(); R.saved = !/records\/new/.test(R.url); R.errs = await errs(); R.toast = ((await bodyText()).match(/[^.]{0,60}required[^.]{0,40}/gi) || []).slice(0, 3); await shot('crm-E7');
  if (!R.saved) { await pick('qa_lr_type', 'Refund'); R.visRefund = await vis('qa_lr_order'); R.reqRefund = await isReq('qa_lr_order'); }
  return R; }
