const res = {};
const pop = async () => page.evaluate(() => [...document.querySelectorAll('[role=dialog], [role=menu]')].map(e => e.innerText.replace(/\s+/g, ' ').trim()).join(' || ').slice(0, 1200));
res.inputs = await page.$$eval('main input', is => is.map(i => (i.getAttribute('aria-label') || i.placeholder || '') + '=' + i.value));
for (const b of ['Share dashboard', 'Actions for QA R2W5 chart by pick', 'Add filter']) {
  await page.locator(`main button[aria-label="${b}"]`).first().click().catch(() => page.locator('main button', { hasText: b }).first().click()); await sleep(1800);
  res[b] = await pop(); await shot('s03-' + b.split(' ')[0].toLowerCase());
  await page.keyboard.press('Escape'); await sleep(800);
}
return res;
