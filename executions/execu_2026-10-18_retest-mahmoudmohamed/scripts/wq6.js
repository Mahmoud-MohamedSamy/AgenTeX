const out = {};
const openPanel = async () => { if (!(await page.getByRole('button', { name: 'Criteria field' }).count())) { await page.locator('main button[aria-label*="ilter"]').first().click(); await sleep(1500); } };
await openPanel();
out.rowState = (await page.locator('[role=group][aria-label="Filter these records"]').innerText().catch(() => '')).replace(/\s+/g, ' ');
const ob = page.locator('button[aria-label^="Operator for"]').first(); await ob.click(); await sleep(800);
await page.getByRole('option', { name: 'Equals', exact: true }).click(); await sleep(1200);
out.rowAfter = (await page.locator('[role=group][aria-label="Filter these records"]').innerText().catch(() => '')).replace(/\s+/g, ' ');
const vb = page.locator('button[aria-label^="Value for"]'); out.vbCount = await vb.count();
if (out.vbCount) { await vb.first().click(); await sleep(1000); out.statusValues = []; for (const e of await page.$$('[role=listbox] [role=option]')) out.statusValues.push((await e.innerText()).trim()); await shot('NDC-1788-status-values'); await page.keyboard.press('Escape'); }
return done(out);
