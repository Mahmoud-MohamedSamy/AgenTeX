await go('/workqueue', 15000); await page.getByRole('button', { name: /^My Leads/ }).first().click(); await sleep(6000);
const out = {};
const menuTxt = async () => (await page.locator('[role=menu]').last().innerText().catch(() => '')).replace(/\n+/g, ' | ');
// Reset Column Size before resize
await page.getByRole('button', { name: 'Table settings' }).click(); await sleep(900);
const rcs = page.getByRole('menuitem', { name: 'Reset Column Size' }); out.resetDisabledBefore = (await rcs.getAttribute('aria-disabled')) || String(await rcs.isDisabled().catch(() => 'n/a'));
await page.keyboard.press('Escape'); await sleep(500);
// drag-resize Phone column
const th = page.locator('th', { hasText: 'Phone' }).first(); const w0 = (await th.boundingBox()).width;
const sep = page.getByRole('separator', { name: 'Resize column: Phone' }); const b = await sep.boundingBox();
await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.mouse.down(); await page.mouse.move(b.x + 120, b.y + b.height / 2, { steps: 8 }); await page.mouse.up(); await sleep(1000);
out.phoneWidth = [Math.round(w0), Math.round((await th.boundingBox()).width)]; await shot('NDC-1819-08-resized');
await page.getByRole('button', { name: 'Table settings' }).click(); await sleep(900);
out.resetDisabledAfter = (await rcs.getAttribute('aria-disabled')) || String(await rcs.isDisabled().catch(() => 'n/a'));
await rcs.click(); await sleep(1200); out.phoneWidthAfterReset = Math.round((await th.boundingBox()).width);
// Manage Columns
await page.getByRole('button', { name: 'Table settings' }).click(); await sleep(900);
await page.getByRole('menuitem', { name: 'Manage Columns' }).click(); await sleep(1500);
const dlg = page.locator('[role=dialog]').last(); out.manageCols = (await dlg.innerText()).replace(/\n+/g, ' | ').slice(0, 700);
const s = dlg.locator('input[type=search], input[placeholder*="earch"]').first(); out.mcSearch = await s.count();
if (out.mcSearch) { await s.fill('Phone'); await sleep(800); out.mcFiltered = (await dlg.innerText()).replace(/\n+/g, ' | ').slice(0, 300); out.mcClearBtn = []; for (const e of await dlg.locator('button[aria-label]').all()) out.mcClearBtn.push(await e.getAttribute('aria-label')); await shot('NDC-1819-09-manage-columns-search'); }
out.mcPin = /pin/i.test(await dlg.innerHTML());
await page.keyboard.press('Escape'); await sleep(800);
if (await page.locator('[role=dialog]').count()) { const c = page.getByRole('button', { name: 'Cancel' }); if (await c.count()) await c.click(); }
// filter field search clear (x)
if (!(await page.getByRole('button', { name: 'Criteria field' }).count())) { await page.locator('main button[aria-label*="ilter"]').first().click(); await sleep(1200); }
await page.getByRole('button', { name: 'Criteria field' }).first().click(); await sleep(900);
await page.getByPlaceholder('Search fields').fill('Ph'); await sleep(700);
out.filterSearchButtons = []; for (const e of await page.locator('[role=dialog] button[aria-label], [data-radix-popper-content-wrapper] button[aria-label]').all()) out.filterSearchButtons.push(await e.getAttribute('aria-label'));
await shot('NDC-1819-04-filter-search'); await page.keyboard.press('Escape');
return done(out);
