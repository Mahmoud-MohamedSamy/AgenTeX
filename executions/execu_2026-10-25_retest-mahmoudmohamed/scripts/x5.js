const out = {};
await page.getByRole('button', { name: 'Table settings' }).click(); await sleep(700); await page.getByText('Manage Columns', { exact: true }).click(); await sleep(1500);
const dlg = page.locator('[role=dialog]').last(); out.manage = (await dlg.innerText()).slice(0, 500);
out.pinControls = await dlg.locator('button, [role=switch]').evaluateAll(es => es.map(e => e.getAttribute('aria-label') || e.title || e.innerText.trim()).filter(x => /pin/i.test(x)));
const s = dlg.locator('input[type=search], input[placeholder*="earch"]').first(); await s.fill('Pri'); await sleep(600);
out.clearAfterTyping = await dlg.locator('button[aria-label*="lear"], button[title*="lear"]').count(); await shot('1819-07-manage-columns');
await dlg.locator('button[aria-label*="lear"], button[title*="lear"]').first().click().catch(() => {}); await sleep(400); out.searchAfterClear = await s.inputValue();
await page.keyboard.press('Escape'); await sleep(600);
// filter panel search x
await page.getByRole('button', { name: /^Filter/ }).first().click(); await sleep(1200); await page.getByRole('button', { name: 'Criteria field' }).first().click(); await sleep(900);
const fs = page.locator('[role=listbox] input, [role=dialog] input, input[placeholder*="earch"]').last(); await fs.fill('Sta'); await sleep(600);
out.filterSearchClear = await page.locator('button[aria-label*="lear search" i], button[aria-label="Clear"], button[title*="lear" i]').count(); await shot('1819-08-filter-search-x');
await page.keyboard.press('Escape'); await sleep(400); await page.keyboard.press('Escape');
const grp = page.getByRole('group', { name: 'Filter these records' }); if (await grp.count()) await grp.getByRole('button', { name: 'Clear filters' }).click().catch(() => {});
return done(out);
