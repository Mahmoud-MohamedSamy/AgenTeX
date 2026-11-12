await page.goto(HC + 'tickets', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(6000);
await page.getByText('QA GL W4 portal 02').first().click(); await page.waitForTimeout(7000);
const b = (await page.locator('main').innerText()).replace(/\s+/g, ' '); out.portalHas = b.includes('DETAILS55'); out.portal = b.slice(0, 500);
await shot('w4/W4-44-portal02-portal');
