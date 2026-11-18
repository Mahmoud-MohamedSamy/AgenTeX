await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/tickets/list/all-cases', { waitUntil: 'commit' }).catch(() => {}); await page.waitForTimeout(9000);
await page.mouse.click(1461, 24); await page.waitForTimeout(6000); out.u = page.url();
const s = page.locator('input[placeholder*="Search" i]').first(); if (await s.count()) { await s.fill('Notification'); await page.waitForTimeout(2500); }
out.t = (await body(page)).replace(/\s+/g, ' ').match(/.{0,300}Notification.{0,300}/)?.[0]; await shotZ(page, 'ac2-setup-search');
