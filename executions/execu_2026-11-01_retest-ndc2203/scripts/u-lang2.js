await page.goto(H + '/hq', { waitUntil: 'domcontentloaded', timeout: 150000 }); await sleep(10000);
await page.locator('button', { hasText: /^AR$/ }).first().click(); await sleep(1500);
await page.getByText('English', { exact: true }).first().click(); await sleep(4000);
await page.reload({ waitUntil: 'domcontentloaded' }); await sleep(9000);
return { lang: await page.evaluate(() => document.documentElement.lang + ' ' + document.documentElement.dir) };
