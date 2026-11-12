async (page) => { const R = {}; const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3', lid = '3847cbd4-508c-4402-9602-e63a72a0f1d7';
  // EN first: M2 + F20 in English
  await openCreate(mid, lid); await pick('qa_lr_tier', 'ذهبي'); R.M2_orderVis = await vis('qa_lr_order'); await pick('qa_lr_tier', 'Silver'); R.F20_en = (await bodyText()).includes('QA en only msg');
  // switch to Arabic
  await page.locator('button', { hasText: /^EN$/ }).first().click(); await sleep(800); R.langOpts = await page.locator('[role=menuitem],[role=option],[role=menuitemradio]').allInnerTexts();
  const ar = page.locator('[role=menuitem],[role=option],[role=menuitemradio]', { hasText: /العربية|Arabic|AR/ }).first(); if (await ar.count()) { await ar.click(); await sleep(4000); }
  R.dir = await page.evaluate(() => document.documentElement.dir || document.body.dir);
  await openCreate(mid, lid); await pick('qa_lr_tier', 'Silver'); const t = await bodyText(); R.F20_ar = t.includes('QA en only msg'); R.F20_msgArea = (t.match(/.{0,40}QA en only msg.{0,20}/) || [''])[0]; await shot('crm-F20-ar');
  await pick('qa_lr_tier', 'ذهبي'); R.M2_ar = await vis('qa_lr_order');
  await page.goto(HOST + '/settings/modules-and-fields/' + mid + '?tab=layout-rules', { waitUntil: 'domcontentloaded' }); await sleep(5000); const tl = await bodyText(); R.M1_list = tl.slice(tl.indexOf('QA LR1112 tier') - 400, tl.indexOf('QA LR1112 tier')).slice(-400); await shot('crm-M1-list');
  await page.locator('tr', { hasText: 'QA LR1112 basic' }).locator('button').nth(1).click(); await sleep(4000); const te = await bodyText(); const i = te.indexOf('QA LR1112 basic'); R.M1_editor = te.slice(i, i + 500); R.enLeft = (te.match(/\b(Condition|Show fields|Add action|Primary field|Preview|Mandatory|Visible|Hidden)\b/g) || []).slice(0, 10); await shot('crm-M1-editor');
  await page.locator('main button').filter({ hasText: /إلغاء|Cancel/ }).first().click().catch(() => {});
  return R; }
