await page.mouse.move(122, 202); await page.waitForTimeout(1200); await page.mouse.click(122, 202); await page.waitForTimeout(2500);
out.bar = (await body(page)).slice(0, 500); await shotZ(page, 'ac-bulk-bar2');
const mb = page.getByText('More', { exact: true }); out.more = await mb.count(); if (out.more) { await mb.first().click().catch(() => {}); await page.waitForTimeout(1500); out.moreTxt = (await body(page)).slice(0, 700); await shotZ(page, 'ac-bulk-more'); }
