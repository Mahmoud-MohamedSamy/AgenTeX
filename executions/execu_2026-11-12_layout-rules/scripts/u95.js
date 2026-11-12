async (page) => { const R = {}; const dm = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
  await page.goto(HOST + '/modules/' + dm + '/records', { waitUntil: 'domcontentloaded' }); await sleep(6000); if (await relogin()) { await page.goto(HOST + '/modules/' + dm + '/records', { waitUntil: 'domcontentloaded' }); await sleep(6000); }
  await page.getByRole('button', { name: 'Kanban view' }).or(page.getByRole('link', { name: 'Kanban view' })).first().click(); await sleep(6000);
  R.cols = (await page.locator('h3, [class*=column] >> text=/./').allInnerTexts().catch(() => [])).slice(0, 5); R.err = (await bodyText()).match(/Could not load[^.]*\.|unexpected error[^.]*\./gi); await shot('crm-G9-kanban');
  return R; }
