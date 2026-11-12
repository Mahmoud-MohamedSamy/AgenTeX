async (page) => {
  const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const R = {};
  const ids = JSON.parse(require('fs').readFileSync('D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_validation-rules/out/ids-crm.json', 'utf8'));
  await openRec(mid, ids.goodRec);
  const head = page.locator('button').filter({ has: page.locator('svg') }).filter({ hasNotText: /\w/ });
  R.iconBtns = await page.evaluate(() => [...document.querySelectorAll('button')].filter(b => !b.innerText.trim()).map(b => b.getAttribute('aria-label')).filter(Boolean).slice(0, 30));
  const kebab = page.getByRole('button', { name: /more options|more actions|more/i }).last(); R.k = await kebab.count();
  const act = page.getByRole('button', { name: /^Actions$/ }).first(); if (await act.count()) { await act.click(); await sleep(800); R.actions = (await page.getByRole('menuitem').allInnerTexts()).join('|'); await page.keyboard.press('Escape'); await sleep(400); }
  for (const lbl of R.iconBtns.filter(l => /more|option/i.test(l) && !/Automation/.test(l))) { await page.getByRole('button', { name: lbl, exact: true }).first().click({ timeout: 5000 }).catch(() => {}); await sleep(800); R['menu ' + lbl] = (await page.getByRole('menuitem').allInnerTexts()).join('|'); await page.keyboard.press('Escape'); await sleep(400); }
  await page.goto(HOST + '/modules/' + mid + '/records', { waitUntil: 'domcontentloaded' }); await sleep(5000);
  R.listBtns = await page.evaluate(() => [...document.querySelectorAll('button')].map(b => (b.getAttribute('aria-label') || b.innerText).trim()).filter(Boolean).slice(0, 40));
  return R;
}
