async (page) => {
  const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3', lid = '3847cbd4-508c-4402-9602-e63a72a0f1d7';
  const R = {}; const S = 'QA LR1112 Sec B';
  await openCreate(mid, lid);
  R.secB_start = await secVis(S);
  await pick('qa_lr_type', 'Question'); R.secB_question = await secVis(S); R.reason_question_noTier = await vis('qa_lr_reason');
  await pick('qa_lr_tier', 'Gold'); R.reason_question_gold = await vis('qa_lr_reason'); R.note_req_gold = await isReq('qa_lr_note');
  await pick('qa_lr_type', 'Refund'); R.secB_refund = await secVis(S); R.reason_refund_gold = await vis('qa_lr_reason');
  await pick('qa_lr_type', 'Partner'); R.secB_partner = await secVis(S);
  await shot('crm-u05');
  // D15 quick toggling
  for (const v of ['Refund', 'Question', 'Refund', 'Other', 'Refund']) await pick('qa_lr_type', v);
  R.D15_after_toggle_order = await vis('qa_lr_order'); R.D15_secB = await secVis(S);
  // E3: Refund, order empty, save -> blocked
  await typeIn('first_name', 'QA LR1112 rec E3');
  await pick('qa_lr_tier', 'Bronze'); // tier bronze requires order too
  await save(); R.E3_url = page.url(); R.E3_errs = await errs(); R.E3_blocked = /records\/new/.test(page.url());
  await shot('crm-E3-blocked');
  // fill order and save: E6 later
  await typeIn('qa_lr_order', 'QA keep me');
  // E6: switch to Question (order hidden) then save
  await pick('qa_lr_type', 'Question'); R.E6_order_vis = await vis('qa_lr_order');
  await pick('qa_lr_tier', 'Gold'); await typeIn('qa_lr_note', 'QA note');
  await save(); R.E6_url = page.url(); R.E6_errs = await errs();
  return R;
}
