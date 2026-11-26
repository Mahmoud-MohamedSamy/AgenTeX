await go('/'); await sleep(3500);
const b = page.locator('header button, nav button', { hasText: /^(AR|EN)$/ }).first();
const R = { btn: await b.innerText().catch(() => 'n/a') };
await b.click(); await sleep(1200); await shot('lang-menu-ar');
R.items = (await page.locator('[role=menuitem], [role=option], [role=menuitemradio]').allInnerTexts()).map(s => s.trim()).slice(0, 10);
const en = page.locator('[role=menuitem], [role=option], [role=menuitemradio]', { hasText: /English|الإنجليزية|الانجليزية/ }).first();
R.enCount = await en.count();
if (R.enCount) { await en.click(); await sleep(5000); }
R.dir = await page.evaluate(() => document.documentElement.dir); R.btnAfter = await page.locator('header button, nav button', { hasText: /^(AR|EN)$/ }).first().innerText().catch(() => 'n/a');
await page.reload(); await sleep(4000); R.dirReload = await page.evaluate(() => document.documentElement.dir);
return R;
