await page.keyboard.press('Escape'); await page.waitForTimeout(1000);
for (const t of ['Explore Now', 'Close', 'Skip', 'Got it', 'Later']) { const b = page.getByText(t, { exact: true }); if (await b.count()) { /* do not click Explore */ } }
const x = page.locator('[aria-label="Close"], [data-id*="close" i], .zd-modal-close, [class*="closeIcon"]'); out.x = await x.count(); if (out.x) await x.first().click({ force: true }).catch(() => {}); await page.waitForTimeout(1500);
await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/tickets/new', { waitUntil: 'commit' }).catch(() => {}); await page.waitForTimeout(12000);
out.t = (await body(page)).slice(0, 900); await shotZ(page, 'ac-ag2-newticket');
