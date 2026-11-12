async (page) => { const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3', lid = '3847cbd4-508c-4402-9602-e63a72a0f1d7'; const R = {};
  await openCreate(mid, lid); await pick('qa_lr_tier','Bronze2'); R.orderReqBronze2 = await isReq('qa_lr_order'); R.orderVis = await vis('qa_lr_order'); await shot('crm-D17-form');
  await page.goto(HOST + '/settings/modules-and-fields/' + mid + '?tab=layout-rules', { waitUntil: 'domcontentloaded' }); await sleep(5000);
  await page.locator('tr', { hasText: 'QA LR1112 radio' }).locator('button').nth(1).click(); await sleep(5000);
  const t = await bodyText(); const i = t.indexOf('Condition 2'); R.radioC2 = t.slice(i, i + 350); const j = t.indexOf('Condition 10'); R.radioC10 = t.slice(j, j + 400);
  return R; }
