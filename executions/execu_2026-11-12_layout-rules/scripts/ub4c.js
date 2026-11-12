async (page) => {
  const names = async () => { await sleep(1500); return page.evaluate(() => [...document.querySelectorAll('tbody tr')].map(r => r.querySelector('td') ? r.querySelector('td').innerText.trim().replace('QA LR1112 B4 ', '') : '').filter(Boolean)); };
  const choose = async (btnText, opt) => { await page.locator('button', { hasText: btnText }).first().click(); await sleep(700); const o = page.getByRole('option', { name: opt, exact: true }); if (await o.count()) await o.first().click(); else await page.getByRole('menuitemradio', { name: opt }).first().click().catch(async () => page.locator('[role=listbox] >> text="' + opt + '"').first().click()); await sleep(300); await page.keyboard.press('Escape').catch(() => {}); };
  const out = { start: await names() };
  await page.locator('button', { hasText: 'All layouts' }).first().click(); await sleep(700); out.layoutOptions = await page.evaluate(() => [...document.querySelectorAll('[role=option],[role=menuitemradio],[role=menuitemcheckbox]')].map(o => o.innerText.trim())); await page.keyboard.press('Escape'); await sleep(400);
  await choose('All layouts', 'QA LR1112 Layout'); out.byLayout = await names();
  await page.locator('button', { hasText: 'Any status' }).first().click(); await sleep(700); out.statusOptions = await page.evaluate(() => [...document.querySelectorAll('[role=option],[role=menuitemradio],[role=menuitemcheckbox]')].map(o => o.innerText.trim())); await page.keyboard.press('Escape'); await sleep(400);
  const act = out.statusOptions.find(s => /^active$/i.test(s)) || 'Active'; await choose('Any status', act); out.layoutPlusActive = await names();
  const dis = out.statusOptions.find(s => /disabled|inactive/i.test(s)); if (dis) { await choose(act, dis); out.layoutPlusDisabled = await names(); }
  out.clearBtns = await page.evaluate(() => [...document.querySelectorAll('button')].map(b => b.innerText.trim()).filter(t => /clear|reset/i.test(t))); await shot('crm-B4-2', false);
  if (out.clearBtns.length) { await page.locator('button', { hasText: out.clearBtns[0] }).first().click(); out.afterClear = await names(); out.filterLabels = await page.evaluate(() => [...document.querySelectorAll('button')].map(b => b.innerText.trim()).filter(t => /layout|status/i.test(t)).slice(0, 4)); }
  await page.locator('input[placeholder="Search rules"]').fill('default'); out.search = await names(); await page.locator('input[placeholder="Search rules"]').fill('');
  return out;
}
