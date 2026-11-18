await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/tickets/list/all-cases', { waitUntil: 'commit' }).catch(() => {}); await page.waitForTimeout(4000);
const d = page.getByText(/Discard|Leave/).first(); if (await d.count()) await d.click().catch(() => {}); out.ok = 1;
