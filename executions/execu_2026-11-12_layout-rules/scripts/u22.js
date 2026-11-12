async (page) => { const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3', lid = '3847cbd4-508c-4402-9602-e63a72a0f1d7'; const R = {};
  await openCreate(mid, lid); await wrap('owner').locator('button[role=combobox]').first().click(); await sleep(1500);
  R.opts = (await page.getByRole('option').allInnerTexts()).slice(0,8);
  const o = page.getByRole('option').filter({ hasText: 'ndc-staging-owner' }); R.n = await o.count(); if (R.n) { await o.first().click(); await sleep(1200); } else await page.keyboard.press('Escape');
  R.reasonAfterPick = await vis('qa_lr_reason');
  await openRec(mid, '29bb450e-9c1b-4a39-8ddb-3f4ac6067325'); R.detailHasReason = (await bodyText()).includes('QA LR1112 reason');
  return R; }
