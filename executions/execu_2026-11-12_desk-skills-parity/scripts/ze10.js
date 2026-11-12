async (page) => { await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/tickets/list/all-cases', {waitUntil:'domcontentloaded'}); await page.waitForTimeout(5000); return page.url(); }
