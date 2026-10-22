const lab = page.getByText('Phone Permission', { exact: true }).first();
await lab.hover(); await sleep(500);
const box = lab.locator('xpath=ancestor::*[.//button[@aria-label="Field options"]][1]');
await box.getByRole('button', { name: 'Field options' }).first().click(); await sleep(1000);
const menu = await page.locator('[role=menu]').allInnerTexts();
const prop = page.getByRole('menuitem', { name: /Properties|Edit Properties/i }).first();
if (await prop.count()) { await prop.click(); await sleep(2500); }
const d = await page.locator('[role=dialog]').allInnerTexts();
await shot('1230-02-properties');
return done({ menu, d: d.map(x => x.slice(0, 1200)) });
