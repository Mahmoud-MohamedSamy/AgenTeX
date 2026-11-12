async (page) => {
  const names = async () => { await sleep(4000); return page.evaluate(() => [...document.querySelectorAll('tbody tr')].map(r => r.querySelector('td').innerText.trim().replace('QA LR1112 ', '').replace('QA NDC ', 'NDC:'))); };
  const fbar = page.locator('button[aria-haspopup=listbox], button[role=combobox]');
  const out = {}; const dep = fbar.filter({ hasText: /department/i }).first(); await dep.click(); await sleep(800); await page.getByRole('option', { name: 'HR', exact: true }).click(); await sleep(600); await page.keyboard.press('Escape').catch(() => {});
  out.bar = await fbar.allInnerTexts(); out.hr = await names(); out.reqs = []; await shot('desk-B4-HR', false);
  await page.locator('button', { hasText: 'Clear filters' }).first().click(); await sleep(500);
  const lay = fbar.filter({ hasText: /layout/i }).first(); await lay.click(); await sleep(800); await page.getByRole('option', { name: 'QA LR1112 Layout', exact: true }).click(); await sleep(600); await page.keyboard.press('Escape').catch(() => {});
  out.bar2 = await fbar.allInnerTexts(); out.byLayout = await names();
  await page.locator('button', { hasText: 'Clear filters' }).first().click(); return out;
}
