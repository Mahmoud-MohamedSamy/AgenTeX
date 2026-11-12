async (page) => { const R = {}; const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; await page.keyboard.press('Escape');
  await page.goto(HOST + '/modules/' + mid + '/records', { waitUntil: 'domcontentloaded' }); await sleep(7000);
  const ra = page.getByRole('button', { name: 'Row actions' }); R.n = await ra.count(); if (R.n) { await ra.first().click(); await sleep(1000); R.menu = await page.locator('[role=menuitem]').allInnerTexts(); await page.keyboard.press('Escape'); }
  R.bundleClone = null; return R; }
