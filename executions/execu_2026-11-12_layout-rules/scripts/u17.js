async (page) => { const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3', lid = '3847cbd4-508c-4402-9602-e63a72a0f1d7'; const R = {};
  await openCreate(mid, lid); await pick('qa_lr_type', 'Question'); await pick('qa_lr_tier', 'Gold'); R.q_gold_order = await vis('qa_lr_order');
  await pick('qa_lr_type', 'Refund'); await pick('qa_lr_tier', 'Silver'); R.refund_silver_order = await vis('qa_lr_order'); R.refund_silver_req = await isReq('qa_lr_order'); return R; }
