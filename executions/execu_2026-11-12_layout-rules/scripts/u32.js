async (page) => { const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3', lid = '3847cbd4-508c-4402-9602-e63a72a0f1d7'; const R = {};
  await openCreate(mid, lid); R.vip0 = await vis('qa_lr_vip');
  await pick('qa_lr_type','Partner'); R.vipP = await vis('qa_lr_vip'); R.date0 = await vis('qa_lr_date');
  await tick('qa_lr_vip', true); R.dateOn = await vis('qa_lr_date'); await shot('crm-H4');
  await pick('qa_lr_type','Refund'); R.vipR = await vis('qa_lr_vip'); R.dateAfterHide = await vis('qa_lr_date');
  // D17
  R.tierOpts = await options('qa_lr_tier'); await pick('qa_lr_tier','Bronze2'); R.orderReqBronze2 = await isReq('qa_lr_order');
  // list warning
  await page.goto(HOST + '/settings/modules-and-fields/' + mid + '?tab=layout-rules', { waitUntil: 'domcontentloaded' }); await sleep(5000);
  R.tierRow = await page.locator('tr', { hasText: 'QA LR1112 tier' }).first().innerText(); R.tierRowWarn = await page.locator('tr', { hasText: 'QA LR1112 tier' }).first().locator('svg[class*=alert], svg[class*=triangle], [title]').count(); await shot('crm-D17');
  // C20 open deep rule
  await page.locator('tr', { hasText: 'QA LR1112 deep' }).locator('button').nth(1).click(); await sleep(5000);
  const t = await bodyText(); const i = t.indexOf('Condition 1'); R.deep = t.slice(i, i + 600); await shot('crm-C20');
  return R; }
