await page.goto(HC + 'tickets', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(6000);
out.list = (await page.locator('main').innerText()).replace(/\s+/g, ' ').slice(0, 500);
await shot('w4/W4-45-my-tickets');
await page.getByText('QA GL W4 portal 01').first().click(); await page.waitForTimeout(6000);
out.ticketUrl = page.url().replace(HC, '~/');
const body = (await page.locator('main').innerText()).replace(/\s+/g, ' ');
out.ticket = body.slice(0, 900); out.seesReply = body.includes('AGENTVISIBLE77'); out.seesPrivate = body.includes('PRIVHIDDEN88');
await shot('w4/W4-45-portal-ticket');
