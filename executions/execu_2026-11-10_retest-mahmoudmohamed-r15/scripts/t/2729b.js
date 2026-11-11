await page.goto(H + '/settings/blueprints', { waitUntil: 'domcontentloaded' });
await page.getByText('Pipeline+Blueprint').first().waitFor({timeout:120000});
const row = page.locator('tr', { hasText: 'AEX-01' }).last();
log(await row.evaluate(r => r.outerHTML.slice(0, 1500)));
await row.getByText('AEX-01', {exact:true}).click(); await sleep(6000); log(page.url());
