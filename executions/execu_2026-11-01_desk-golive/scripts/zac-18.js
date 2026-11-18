await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/tickets/list/all-cases', { waitUntil: 'commit' }).catch(() => {}); await page.waitForTimeout(12000);
const nn = page.getByText('Not Now', { exact: true }); if (await nn.count()) await nn.first().click().catch(() => {});
const row = page.locator('[data-id*="listItem"], li', { hasText: 'QA AC Z6' }).first(); const bb = await row.boundingBox().catch(() => null); out.bb = bb;
if (bb) { await page.mouse.move(bb.x + 15, bb.y + 20); await page.waitForTimeout(800); await page.mouse.click(bb.x + 15, bb.y + 20); await page.waitForTimeout(2500); }
out.bar = (await body(page)).slice(0, 700); await shotZ(page, 'ac-bulk-bar');
