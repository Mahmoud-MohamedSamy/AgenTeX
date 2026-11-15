const R = {};
await page.goto(H + '/modules/' + MID + '/records', { waitUntil: 'domcontentloaded' }); await sleep(8000);
await page.getByRole('button', { name: 'List view' }).click(); await sleep(4000);
await page.locator('select').filter({ hasText: 'Standard' }).first().selectOption({ label: 'QA RT18 Layout' }); await sleep(6000);
const rowsQ = page.locator('main tbody tr', { hasText: /QA RT18 (mass2|E6 keep)/ }); const n = await rowsQ.count();
for (let i = 0; i < n; i++) await rowsQ.nth(i).locator('input[type=checkbox]').first().click(); await sleep(1500);
await page.getByRole('button', { name: 'Module actions' }).click(); await sleep(1200); R.menu = await page.getByRole('menuitem').allInnerTexts();
await shot('2974-2-menu.png');
const mi = page.getByRole('menuitem', { name: /Mass Update|Update/i }).first(); R.has = await mi.count();
if (R.has) { await mi.click(); await sleep(2500); const d = page.locator('[role=dialog]').first(); R.dlg = (await d.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 500); await shot('2974-3-dialog.png'); }
return R;
