async (page) => {
  const names = async () => { await sleep(2500); return page.evaluate(() => [...document.querySelectorAll('tbody tr')].map(r => r.innerText.replace(/\s+/g, ' ').trim().replace(/QA LR1112 /g, '')).filter(Boolean)); };
  const pickOpt = async (btn, opt) => { await btn.click(); await sleep(800); await page.getByRole('option', { name: opt, exact: true }).first().click(); await sleep(500); await page.keyboard.press('Escape').catch(() => {}); };
  const fbar = page.locator('button[aria-haspopup=listbox], button[role=combobox]');
  const out = { bar: await fbar.allInnerTexts() };
  const layBtn = fbar.filter({ hasText: /layout/i }).first(); await pickOpt(layBtn, 'QA LR1112 Layout'); out.bar1 = await fbar.allInnerTexts(); out.byLayout = await names(); await shot('crm-B4-layout', false);
  const stBtn = fbar.filter({ hasText: /status/i }).first(); await pickOpt(stBtn, 'Inactive'); out.bar2 = await fbar.allInnerTexts(); out.layoutInactive = await names(); await shot('crm-B4-inactive', false);
  await page.locator('button', { hasText: 'Clear filters' }).first().click(); out.bar3 = await fbar.allInnerTexts(); out.afterClear = await names();
  return out;
}
