async (page) => { const R = {}; const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3', lid = '3847cbd4-508c-4402-9602-e63a72a0f1d7';
  await openCreate(mid, lid); await pick('qa_lr_type', 'Refund'); R.orderVisRefund = await vis('qa_lr_order'); R.orderReqRefund = await isReq('qa_lr_order');
  await pick('qa_lr_type', 'Partner'); R.noteReq0 = await isReq('qa_lr_note'); await tick('qa_lr_vip', true); R.noteReqVip = await isReq('qa_lr_note'); R.dateOnForm = await page.locator('[data-rule-field=qa_lr_date]').count(); await shot('crm-J3');
  await page.goto(HOST + '/settings/modules-and-fields/' + mid + '?tab=layout-rules', { waitUntil: 'domcontentloaded' }); await sleep(5000);
  R.listWarn = await page.locator('tr', { hasText: 'QA LR1112 vip' }).first().innerHTML().then(h => /alert|triangle|warn/i.test(h));
  await page.locator('tr', { hasText: 'QA LR1112 vip' }).locator('button').nth(1).click(); await sleep(4500); const t = await bodyText(); R.editorFlag = (t.match(/[^.]{0,60}(No longer on this layout|not on this layout)[^.]{0,60}/gi) || []).slice(0, 3); await shot('crm-J3-editor');
  await page.locator('main button', { hasText: /^Cancel$/ }).first().click().catch(() => {});
  return R; }
