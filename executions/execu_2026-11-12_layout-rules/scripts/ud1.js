async (page) => {
  const mid = '88e8ea44-1658-4df3-9930-d0902b91073d', lid = 'e8eb01f2-214d-4ce1-9790-8d8a93c2e953';
  const R = {};
  await openCreate(mid, lid); R.url = page.url(); R.wrappers = await page.locator('[data-rule-field]').count();
  const F = ['qa_lr_order', 'qa_lr_reason', 'qa_lr_date', 'qa_lr_note'];
  R.start = await visMany(F);
  await pick('qa_lr_type', 'Refund'); R.refund = await visMany(F); R.refundReq = await isReq('qa_lr_order');
  await shot('desk-E1-refund');
  await pick('qa_lr_type', 'Question'); R.question = await visMany(F);
  await pick('qa_lr_tier', 'Gold'); R.gold = await visMany(F); R.goldNoteReq = await isReq('qa_lr_note');
  await pick('qa_lr_type', 'Other'); await typeIn('qa_lr_amount', 50); R.D7_order = await vis('qa_lr_order');
  await tick('qa_lr_vip', true); R.D3_date = await vis('qa_lr_date');
  R.req_fields = await page.evaluate(() => [...document.querySelectorAll('[data-rule-field]')].filter(w => /\*/.test(w.querySelector('label')?.innerText || '')).map(w => w.getAttribute('data-rule-field')));
  await shot('desk-ud1');
  return R;
}
