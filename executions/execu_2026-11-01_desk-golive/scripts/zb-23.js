await page.getByText('Deselect All').first().click().catch(() => {}); await page.waitForTimeout(1500);
const sel = async () => (await body(page)).match(/^.{0,200}?(\d+) Assign To/)?.[1] || '0';
out.afterDeselect = await sel();
const rows = page.locator('text=/^QA GL TM zoho [23]$/');
for (let i = 0; i < await rows.count(); i++) { const b = await rows.nth(i).boundingBox(); if (b) { await page.mouse.move(123, b.y + 10); await page.waitForTimeout(400); await page.mouse.click(123, b.y + 10); await page.waitForTimeout(800); } }
out.selected = await sel(); await shotZ(page, 'list-select2');
