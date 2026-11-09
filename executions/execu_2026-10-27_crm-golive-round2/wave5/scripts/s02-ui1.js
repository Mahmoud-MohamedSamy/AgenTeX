await page.goto(H + '/reports', { waitUntil: 'domcontentloaded' }); await sleep(8000);
await page.locator('button', { hasText: /^New report$/ }).first().click(); await sleep(4000);
await shot('s02-new-report');
const t = (await page.innerText('body')).replace(/\s+/g, ' ');
return { url: page.url().replace(H, ''), text: t.slice(t.indexOf('Meetings') + 8, t.indexOf('Meetings') + 2000) };
