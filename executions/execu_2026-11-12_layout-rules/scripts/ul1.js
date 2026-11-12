async (page) => { const R = {}; const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3', lid = '3847cbd4-508c-4402-9602-e63a72a0f1d7';
  await page.goto(HOST + '/settings/modules-and-fields/' + mid + '?tab=layout-rules', { waitUntil: 'domcontentloaded' }); await sleep(6000); const t = await bodyText(); R.A2 = t.slice(0, 0) + (t.match(/(QA LR1112 tier|No access|not have permission|permission|Access denied|403)[^.]{0,100}/gi) || []).slice(0, 4); R.A2url = page.url().slice(-60); await shot('crm-A2-low');
  await openCreate(mid, lid); R.formFields = await page.locator('[data-rule-field]').count();
  await pick('qa_lr_type', 'Refund'); R.G22_orderVis = await vis('qa_lr_order'); R.H7_orderReq = await isReq('qa_lr_order'); R.H7_orderRO = await isRO('qa_lr_order'); await shot('crm-H7');
  await typeIn('first_name', 'QA LR1112 rec H7 low'); await page.getByRole('button', { name: /^Save$/ }).last().click(); await sleep(4000); R.H7_url = page.url().slice(-50); R.H7_msgs = ((await bodyText()).match(/[^.]{0,50}(required|saved|cannot)[^.]{0,80}/gi) || []).slice(0, 3); await shot('crm-H7-save');
  await openCreate(mid, lid); await pick('qa_lr_type', 'Partner'); R.vipVis = await vis('qa_lr_vip'); if (R.vipVis) { await tick('qa_lr_vip', true); R.H8_dateVis = await vis('qa_lr_date'); R.H8_dateInDom = await page.locator('[data-rule-field=qa_lr_date]').count(); }
  await pick('qa_lr_filter', 'X'); R.F25_msg = (await bodyText()).includes('QA warn msg'); R.F7_textRO = await isRO('qa_lr_text'); await shot('crm-F7-low');
  return R; }
