const sel = page.locator('main select').first();
let opts;
if (await sel.count()) { opts = await sel.evaluate(s => [...s.options].map(o => o.text)); const o = opts.find(x => /QA R2W5 Child/.test(x)); if (o) await sel.selectOption({ label: o }); }
else { await page.locator('main button, main [role=combobox]', { hasText: 'Choose Child Module' }).first().click(); await sleep(1000); opts = await page.$$eval('[role=option]', os => os.map(o => o.innerText.trim())); await page.locator('[role=option]', { hasText: /QA R2W5 Child/ }).first().click(); }
await sleep(800);
await page.locator('main button', { hasText: /^Done$/ }).first().click(); await sleep(1200);
await shot('s02-child-added');
await page.locator('main button, header button', { hasText: /^Continue$/ }).first().click(); await sleep(7000);
await shot('s02-columns');
const t = (await page.innerText('main')).replace(/\s+/g, ' ');
return { opts, text: t.slice(-2500) };
