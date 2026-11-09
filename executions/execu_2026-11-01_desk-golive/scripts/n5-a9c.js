const o = {};
const row = page.locator('tr').filter({ hasText: 'Status status Status' }).first(); o.r = await row.count();
o.btns = await row.locator('button, a').evaluateAll(b => b.map(x => (x.getAttribute('aria-label') || x.innerText).trim()));
await row.locator('td').first().click().catch(e => o.e = e.message.slice(0, 60)); await sleep(3000);
o.dialog = (await page.$$eval('[role=dialog]', d => d.map(x => x.innerText.replace(/\s+/g, ' ').slice(0, 900))))[0];
o.shot = await shot('a9/tavi-status-field');
return JSON.stringify(o);
