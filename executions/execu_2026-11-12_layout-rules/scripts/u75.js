async (page) => { const R = {}; await page.goto(HOST + '/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/records', { waitUntil: 'domcontentloaded' }); await sleep(6000);
  await page.getByRole('button', { name: 'Kanban view' }).or(page.getByRole('link', { name: 'Kanban view' })).first().click(); await sleep(5000);
  R.url = page.url().slice(-80); const t = await bodyText(); R.t = t.slice(t.indexOf('Kanban'), t.indexOf('Kanban') + 500); R.combos = (await page.locator('button[role=combobox],button[aria-haspopup]').allInnerTexts()).slice(0, 12); await shot('crm-G8');
  return R; }
