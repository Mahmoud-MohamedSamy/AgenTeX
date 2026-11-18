await page.goto(H + '/views/all/tickets/5c68004d-860c-4bcd-b6b8-77e0bce5c044', { waitUntil: 'domcontentloaded' }); await sleep(9000);
await page.mouse.click(1561, 28); await sleep(2000); await page.getByText('Accessibility', { exact: true }).click(); await sleep(2000);
const t = (await text()).replace(/\s+/g, ' '); const i = t.indexOf('Accessibility');
return { acc: t.slice(i, i + 900).replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+/g, '<email>'), ls: await page.evaluate(() => Object.keys(localStorage)) };
