async (page) => { const R = {}; const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3', lid = '3847cbd4-508c-4402-9602-e63a72a0f1d7';
  const errsC = []; page.on('pageerror', e => errsC.push(e.message.slice(0, 100)));
  await openCreate(mid, lid); await pick('qa_lr_type', 'Partner'); await tick('qa_lr_vip', true); R.dateVis = await vis('qa_lr_date'); R.msgForOwner = (await bodyText()).includes('QA F26 profile msg');
  await page.goto(HOST + '/settings/modules-and-fields/' + mid + '?tab=layout-rules', { waitUntil: 'domcontentloaded' }); await sleep(5000); await page.locator('tr', { hasText: 'QA LR1112 vip' }).locator('button').nth(1).click(); await sleep(4500);
  const t = await bodyText(); const i = t.indexOf('ONLY FOR PROFILES', t.indexOf('QA F26')); R.editor = t.slice(t.indexOf('Show a message') , t.indexOf('Show a message') + 400); await shot('crm-F26'); R.pageErrors = errsC;
  await page.locator('main button', { hasText: /^Cancel$/ }).first().click().catch(() => {}); return R; }
