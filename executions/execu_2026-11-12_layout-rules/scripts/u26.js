async (page) => { const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3', lid = '3847cbd4-508c-4402-9602-e63a72a0f1d7'; const R = {};
  await openCreate(mid, lid); const cb = wrap('owner').locator('button[role=combobox]'); R.cbs = await cb.count(); await cb.last().click(); await sleep(1500);
  await shot('crm-D5-pick', false); R.opts = (await page.locator('[role=option]').allInnerTexts()).slice(0,10);
  const inp = page.locator('[role=dialog] input, [cmdk-input], [role=listbox] input').first(); if (await inp.count()) { await inp.fill('Mahmoud'); await sleep(2000); R.opts2 = (await page.locator('[role=option]').allInnerTexts()).slice(0,6); const o = page.locator('[role=option]').first(); if (await o.count()) { await o.click(); await sleep(1500); } }
  R.ownerNow = await valOf('owner'); R.reasonOther = await vis('qa_lr_order');
  await cb.last().click(); await sleep(1200); const inp2 = page.locator('[role=dialog] input, [cmdk-input], [role=listbox] input').first(); if (await inp2.count()) { await inp2.fill('ndc-staging'); await sleep(2000); R.opts3 = (await page.locator('[role=option]').allInnerTexts()).slice(0,6); const o = page.locator('[role=option]').first(); if (await o.count()) { await o.click(); await sleep(1500); } }
  R.ownerBack = await valOf('owner'); R.reasonBack = await vis('qa_lr_order'); await shot('crm-D5');
  return R; }
