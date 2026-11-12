async (page) => { const R = {};
  const b = page.locator('button', { hasText: 'qa_lr_text (unknown field)' }).first(); R.n = await b.count(); await b.scrollIntoViewIfNeeded(); await b.click(); await sleep(1200);
  R.fieldOpts = (await page.locator('[role=option]').allInnerTexts()).map(s=>s.trim()); await shot('crm-C20-fields', false); await page.keyboard.press('Escape'); await sleep(500);
  return R; }
