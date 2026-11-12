async (page) => {
  const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3', lid = '3847cbd4-508c-4402-9602-e63a72a0f1d7';
  const R = {};
  await openCreate(mid, lid);
  R.start = await visMany(['qa_lr_order', 'qa_lr_reason', 'qa_lr_date']); R.secB0 = await vis('qa_lr_reason');
  // D2/E2 is-one-of -> section B (reason)
  await pick('qa_lr_type', 'Question'); R.D2_question_reason = await vis('qa_lr_reason');
  await pick('qa_lr_type', 'Partner'); R.D2_partner_reason = await vis('qa_lr_reason');
  await pick('qa_lr_type', 'Refund'); R.D2_refund_reason = await vis('qa_lr_reason');
  // D7 AND row
  await pick('qa_lr_type', 'Other'); R.D7_other_amt0 = await vis('qa_lr_order');
  await typeIn('qa_lr_amount', 50); R.D7_other_amt50 = await vis('qa_lr_order');
  await typeIn('qa_lr_amount', 5); R.D7_other_amt5 = await vis('qa_lr_order');
  // D3 checkbox
  await tick('qa_lr_vip', true); R.D3_vip_on_date = await vis('qa_lr_date');
  await tick('qa_lr_vip', false); R.D3_vip_off_date = await vis('qa_lr_date');
  // D13 several branches: Gold -> show reason (b1) + require note (b2, also matches)
  await pick('qa_lr_tier', 'Gold'); R.D13_gold_reason = await vis('qa_lr_reason'); R.D13_gold_note_req = await isReq('qa_lr_note');
  await pick('qa_lr_tier', 'Silver'); R.silver_note_req = await isReq('qa_lr_note'); R.silver_reason = await vis('qa_lr_reason');
  // E5 require on hidden: Bronze -> require order, while type=Other amt5 hides order
  await pick('qa_lr_tier', 'Bronze'); R.E5_order_vis = await vis('qa_lr_order'); R.E5_order_req = await isReq('qa_lr_order');
  // D4 radio
  try { await wrap('qa_lr_radio').getByText('Yes', { exact: true }).first().click(); await sleep(800); R.D4_radio_yes_email_req = await isReq('qa_lr_email2'); } catch (e) { R.D4err = e.message.slice(0, 100); }
  await shot('crm-u04-state');
  // E5 save: first_name, type=Other(amt 5) tier=Bronze (order hidden but required by rule) radio yes -> email2 required
  await typeIn('first_name', 'QA LR1112 rec E5');
  await typeIn('qa_lr_email2', 'qa.lr1112@example.com');
  await save(); R.E5_after_save_url = page.url(); R.E5_errs = await errs(); R.E5_text = (await bodyText()).match(/(required|mandatory|is required|Please)[^.]{0,80}/i)?.[0] || '';
  await shot('crm-E5-save');
  R.dialogs = page.__dialogs || [];
  return R;
}
