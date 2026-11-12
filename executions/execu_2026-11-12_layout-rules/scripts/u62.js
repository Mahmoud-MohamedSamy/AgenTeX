async (page) => { const R = {}; const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3', lid = '3847cbd4-508c-4402-9602-e63a72a0f1d7';
  const errsC = []; page.on('pageerror', e => errsC.push(e.message.slice(0, 100)));
  await openCreate(mid, lid); R.opts = (await options('qa_lr_type')).slice(-5); await pick('qa_lr_type', 'Refund'); R.refundOrderReq = await isReq('qa_lr_order'); R.pageErrors = errsC; await shot('crm-J8');
  return R; }
