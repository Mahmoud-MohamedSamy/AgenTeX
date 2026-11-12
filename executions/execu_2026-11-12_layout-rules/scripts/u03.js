async (page) => {
  const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3', lid = '3847cbd4-508c-4402-9602-e63a72a0f1d7';
  await openCreate(mid, lid);
  const r = {}; const F = ['qa_lr_order', 'qa_lr_note', 'qa_lr_reason'];
  r.start = await visMany(F); r.startReq = await isReq('qa_lr_order');
  await pick('qa_lr_type', 'Refund'); r.refund = await visMany(F); r.refundReq = await isReq('qa_lr_order');
  await shot('crm-E1-refund');
  await pick('qa_lr_type', 'Question'); r.question = await visMany(F);
  r.opts = await options('qa_lr_type');
  return r;
}
