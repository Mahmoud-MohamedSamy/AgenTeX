await page.keyboard.press('Escape'); await page.getByText('TechEgySolutions', { exact: true }).first().click(); await page.waitForTimeout(2000);
await page.getByText('All Departments', { exact: true }).first().click().catch(e => out.e1 = e.message.slice(0, 80)); await page.waitForTimeout(9000);
out.t = (await body(page)).slice(0, 600); await shotZ(page, 'ac-alldepts');
const lab = page.locator('text=Tech').nth(2); const bb = await page.getByText('Tech', { exact: true }).nth(1).boundingBox().catch(() => null); out.bb = bb;
if (bb) { await page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2); await page.waitForTimeout(2500); out.after = (await body(page)).slice(0, 400); await shotZ(page, 'ac-alldepts-label'); }
