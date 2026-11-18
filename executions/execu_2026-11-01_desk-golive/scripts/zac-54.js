await page.getByText('Teams', { exact: true }).first().click(); await page.waitForTimeout(8000);
const nn = page.getByText('Not Now', { exact: true }); if (await nn.count()) await nn.first().click().catch(() => {});
const row = page.getByText('QA AC2 Control Team', { exact: true }).first(); out.n = await row.count();
if (out.n) { const bb = await row.boundingBox(); await page.mouse.move(bb.x + 20, bb.y + 8); await page.waitForTimeout(1200); await shotZ(page, 'ac2-team-hover'); }
