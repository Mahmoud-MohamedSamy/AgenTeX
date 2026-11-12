async (page) => {
  await page.goto(HOST + '/settings/modules-and-fields/88e8ea44-1658-4df3-9930-d0902b91073d?tab=layout-rules', { waitUntil: 'domcontentloaded' }); await sleep(4000); if (await relogin()) await page.goto(HOST + '/settings/modules-and-fields/88e8ea44-1658-4df3-9930-d0902b91073d?tab=layout-rules');
  await page.getByText('QA LR1112 B4', { exact: false }).first().waitFor({ timeout: 40000 }).catch(() => {});
  const names = async () => { await sleep(2500); return page.evaluate(() => [...document.querySelectorAll('tbody tr')].map(r => r.querySelector('td').innerText.trim().replace(/QA (LR1112|NDC) /, m => m.startsWith('QA NDC') ? 'NDC:' : '')).filter(Boolean)); };
  const fbar = page.locator('button[aria-haspopup=listbox], button[role=combobox]');
  const pickOpt = async (btn, opt) => { await btn.click(); await sleep(800); await page.getByRole('option', { name: opt, exact: true }).first().click(); await sleep(500); await page.keyboard.press('Escape').catch(() => {}); };
  const out = { start: await names() };
  if (!(await fbar.filter({ hasText: /layout/i }).count())) { await page.getByRole('button', { name: /Filters/ }).first().click(); await sleep(1000); }
  out.bar = await fbar.allInnerTexts();
  const depBtn = fbar.filter({ hasText: /department/i }).first(); await depBtn.click(); await sleep(800); out.depOpts = (await page.getByRole('option').allInnerTexts()).slice(0, 25); await page.keyboard.press('Escape'); await sleep(400);
  const cs = out.depOpts.find(o => /customer support/i.test(o)); if (cs) { await pickOpt(depBtn, cs); out.byCS = await names(); }
  const other = out.depOpts.find(o => /^HR$|human/i.test(o)) || out.depOpts.find(o => !/all|customer support/i.test(o)); if (other) { await pickOpt(fbar.filter({ hasText: cs }).first(), other); out.byOther = await names(); out.other = other; }
  await shot('desk-B4-dept', false);
  await page.locator('button', { hasText: 'Clear filters' }).first().click(); out.afterClear = await names(); out.bar2 = await fbar.allInnerTexts();
  await pickOpt(fbar.filter({ hasText: /layout/i }).first(), 'QA LR1112 Layout'); out.byLayout = await names();
  await pickOpt(fbar.filter({ hasText: /status/i }).first(), 'Inactive'); out.layoutInactive = await names();
  await page.locator('button', { hasText: 'Clear filters' }).first().click(); out.afterClear2 = (await names()).length;
  return out;
}
