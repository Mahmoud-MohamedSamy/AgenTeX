async (page) => { const R = {}; await page.goto(HOST + '/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/records', { waitUntil: 'domcontentloaded' }); await sleep(6000);
  await page.getByRole('button', { name: /^New$/ }).first().click(); await sleep(1500); R.menu = (await page.locator('[role=menuitem],[role=option],[role=dialog] button').allInnerTexts()).slice(0, 15); await shot('crm-G5-new', false);
  R.views = await page.evaluate(() => [...document.querySelectorAll('button,a')].map(b => (b.getAttribute('aria-label') || b.innerText || '').trim()).filter(s => /kanban|view|list|import/i.test(s)).slice(0, 15));
  return R; }
