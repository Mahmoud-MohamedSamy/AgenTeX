const out = {};
await go('/settings/automation/scoring-rules?module=' + MID, 9000);
out.text = (await bodyText()).slice(0, 2500);
out.inputs = await page.locator('main input, main [role=combobox], main select').evaluateAll(e => e.map(x => (x.getAttribute('aria-label') || x.getAttribute('placeholder') || x.tagName)));
await shot('2934-1-list.png');
// row menu of K2b
const row = page.locator('tr, [role=row]').filter({ hasText: 'QA RT18 SR K2b' }).first(); out.k2row = await row.innerText().catch(() => 'no row');
out.k2rowBox = await box(row);
const menu = row.locator('button').last(); await menu.click().catch(() => {}); await sleep(800);
out.menu = await page.locator('[role=menu], [role=menuitem]').allInnerTexts().catch(() => []);
await shot('2934-2-row-menu.png');
await page.keyboard.press('Escape');
return out;
