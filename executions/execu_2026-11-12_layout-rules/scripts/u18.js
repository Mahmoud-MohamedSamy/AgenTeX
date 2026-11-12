async (page) => { const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3', lid = '3847cbd4-508c-4402-9602-e63a72a0f1d7'; const R = {};
  await openCreate(mid, lid); await pick('qa_lr_filter', 'X');
  R.F25_msg_for_User_only_seen_by_owner = (await bodyText()).includes('QA warn msg'); R.F7_text_RO_owner = await page.evaluate(() => !!document.querySelector('[data-rule-field=qa_lr_text] svg.lucide-lock, [data-rule-field=qa_lr_text] [class*=lock]')) || await isRO('qa_lr_text');
  await shot('crm-F25');
  // F8: Y -> email2 read-only + mandatory while empty
  await pick('qa_lr_filter', 'Y'); R.F8_email_req = await isReq('qa_lr_email2'); await typeIn('first_name', 'QA LR1112 rec F8');
  await page.getByRole('button', { name: /^Save$/ }).last().click(); await sleep(3500);
  R.F8_url = page.url(); R.F8_errs = await errs(); R.F8_emailEditable = !(await isRO('qa_lr_email2')); await shot('crm-F8');
  return R; }
