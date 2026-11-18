await page.mouse.click(900, 237); await page.waitForTimeout(800); await page.keyboard.type('qa-ac2-ext@example.com'); await page.waitForTimeout(1500); await page.keyboard.press('Enter'); await page.waitForTimeout(2000);
out.to = (await body(page)).replace(/\s+/g, ' ').match(/To .{0,200}/)?.[0]; await shotZ(page, 'ac2-y4-forward-to');
await page.getByText('Cancel', { exact: true }).last().click().catch(() => {}); await page.waitForTimeout(2000);
const d = page.getByText(/Discard|Yes/).first(); if (await d.count()) await d.click().catch(() => {}); await page.waitForTimeout(1500);
out.after = (await body(page)).includes('Send Private Thread') ? 'composer still open' : 'closed';
