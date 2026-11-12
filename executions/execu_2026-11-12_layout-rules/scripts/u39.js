async (page) => { const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3', lid = '3847cbd4-508c-4402-9602-e63a72a0f1d7', std = 'bf971461-2edc-45f2-b6e4-6e180aa64288'; const R = {};
  // E10
  await openCreate(mid, lid); await pick('qa_lr_tier', 'Gold'); R.E10 = await visMany(['qa_lr_order', 'qa_lr_reason']); R.secB = await secVis('QA LR1112 Sec B'); await shot('crm-E10');
  // G20: standard layout has none of the QA fields? check rules don't break
  await openCreate(mid, std); R.G20_qaFieldsOnStd = await page.locator('[data-rule-field^=qa_lr]').count(); R.G20_body = (await bodyText()).includes('QA LR1112');
  // G6 clone: open record G4 (type Refund?) and look for Clone
  await openRec(mid, '0abf46ab-9372-4b26-a1e3-9c0634903cb7'); R.btns = (await page.getByRole('button').allInnerTexts()).map(s => s.trim()).filter(s => /clone|more|\.\.\./i.test(s) || s === '').length;
  const more = page.getByRole('button', { name: /More|Actions/i }).first(); R.hasMore = await more.count();
  const clone = page.getByRole('menuitem', { name: /Clone/i }).or(page.getByRole('button', { name: /Clone/i })); R.cloneDirect = await clone.count();
  if (!R.cloneDirect && R.hasMore) { await more.click(); await sleep(800); R.menu = await page.locator('[role=menuitem]').allInnerTexts(); }
  return R; }
