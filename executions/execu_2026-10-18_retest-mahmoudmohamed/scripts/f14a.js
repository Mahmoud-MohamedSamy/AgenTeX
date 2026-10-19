// NDC-1819 items 4 and 10: filter field search narrows the list; row ⋮ Edit / Delete (cancelled) on QA RT tz L3.
const out = {};
await page.goto(H + '/workqueue', { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 40 && !(await page.getByRole('button', { name: /^My Leads/ }).count()); i++) await sleep(1000);
await page.getByRole('button', { name: /^My Leads/ }).first().click(); for (let i = 0; i < 30 && (await page.locator('main thead th').count()) < 5; i++) await sleep(1000); await sleep(2500);
// filter search
await page.locator('main button[aria-label*="ilter"]').first().click(); await sleep(1500);
await page.getByRole('button', { name: 'Criteria field' }).first().click(); await sleep(1000);
const pop = page.locator('[data-radix-popper-content-wrapper], [role=dialog]').last();
const items = async () => (await pop.locator('[role=option], [role=menuitem], li, button').allInnerTexts()).map(s => s.trim()).filter(s => s && s.length < 40);
out.before = (await items()).length; await page.getByPlaceholder('Search fields').fill('ph'); await sleep(800); out.afterPh = await items();
await shot('NDC-1819-f-filter-search');
await page.getByPlaceholder('Search fields').fill(''); await sleep(500); out.afterEmpty = (await items()).length;
await page.keyboard.press('Escape'); await sleep(500); await page.keyboard.press('Escape'); await sleep(500);
out.rowsNow=(await page.locator('main tbody tr').allInnerTexts()).slice(0,5).map(x=>x.replace(/s+/g,' '));
return done(out);
