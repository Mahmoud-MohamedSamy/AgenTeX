const out = {};
const sels = page.locator('select'); out.nSelect = await sels.count();
for (let i = 0; i < out.nSelect; i++) out['sel' + i] = await sels.nth(i).locator('option').allInnerTexts();
if (!out.nSelect) { await page.getByText('on', { exact: true }).last().click({ force: true }); await sleep(1000); out.opts = await page.locator("[role='option'], [role='menuitem']").allInnerTexts(); await shot('e5-date-operators'); }
return fin(out);
