async (page) => { const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const R = {};
  await page.keyboard.press('Escape'); await page.goto(HOST + '/settings/modules-and-fields/' + mid + '?tab=layout-rules', { waitUntil: 'domcontentloaded' }); await sleep(5000);
  await page.locator('tr', { hasText: 'QA LR1112 deep' }).locator('button').nth(1).click(); await sleep(5000);
  await page.getByRole('button', { name: /^Save$/ }).first().click(); await sleep(4000);
  R.after = (await bodyText()).match(/(could not be saved[^.]*\.[^.]*\.|Saved[^.]*\.|Every row[^.]*\.|unknown[^.]*\.)/gi); R.url = page.url(); await shot('crm-C20-save');
  const g = await api('GET', '/modules/' + mid + '/layout-rules?layoutId=3847cbd4-508c-4402-9602-e63a72a0f1d7'); const j = JSON.parse(g.t); const d = (j.data||[]).find(x => x.name === 'QA LR1112 deep'); R.cond = d ? JSON.stringify(d.branches[0].condition) : g.t.slice(0, 200);
  return R; }
