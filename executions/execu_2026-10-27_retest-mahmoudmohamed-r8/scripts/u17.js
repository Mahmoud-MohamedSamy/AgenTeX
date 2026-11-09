const out = {};
await page.getByText('QR', { exact: true }).first().hover().catch(() => {}); await sleep(800); await page.getByText('QR', { exact: true }).first().click({ force: true }).catch(() => {}); await sleep(1500); await shot('1678-02-tile-click');
out.afterTile = (await page.locator('[role=dialog], [role=menu], [data-radix-popper-content-wrapper]').allInnerTexts()).join(' | ').slice(0, 400);
out.fileInputs = await page.locator('input[type=file]').count();
await page.keyboard.press('Escape'); await sleep(500);
const adm = page.getByText('mahmoud.mahamed1515', { exact: true }).first(); await adm.click({ force: true }); await sleep(1500); await shot('1678-03-admin-open');
out.adminOptions = (await page.locator('[role=option], [role=listbox] li, [cmdk-item]').allInnerTexts()).slice(0, 10);
await page.keyboard.press('Escape');
return done(out);
