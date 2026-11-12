async (page) => { const R = {}; const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3', lid = '3847cbd4-508c-4402-9602-e63a72a0f1d7';
  // G21: open record G6 edit and look for layout switch
  await openRec(mid, '33f5145a-fe4a-4577-9193-ed613006abef'); await page.getByRole('button', { name: /^Edit$/ }).first().click(); await sleep(5000);
  R.editUrl = page.url().slice(-80); R.combos = (await page.locator('button[role=combobox]').allInnerTexts()).slice(0, 4);
  const lay = page.locator('button[role=combobox]', { hasText: 'QA LR1112 Layout' }).first(); R.layPicker = await lay.count();
  if (R.layPicker) { await lay.click(); await sleep(800); await page.getByRole('option', { name: 'Standard', exact: true }).click(); await sleep(4000); R.after = { url: page.url().slice(-60), qa: await page.locator('[data-rule-field^=qa_lr]').count(), dlg: await page.locator('[role=dialog],[role=alertdialog]').count() }; await shot('crm-G21'); }
  return R; }
