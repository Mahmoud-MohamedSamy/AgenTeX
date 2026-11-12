async (page) => {
  const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3', lid = '3847cbd4-508c-4402-9602-e63a72a0f1d7'; const R = {};
  await page.goto(HOST + '/settings/modules-and-fields/' + mid + '?tab=layout-rules', { waitUntil: 'domcontentloaded' }); await sleep(7000);
  R.B8_list = (await bodyText()).match(/.{0,60}(Rule not applied|does not apply).{0,120}/g);
  await shot('crm-B8-flag', false);
  await openCreate(mid, lid); R.order_start = await vis('qa_lr_order');
  await pick('qa_lr_type', 'Refund'); R.J4_refund_order_vis = await vis('qa_lr_order'); R.J4_refund_order_req = await isReq('qa_lr_order');
  return R;
}
