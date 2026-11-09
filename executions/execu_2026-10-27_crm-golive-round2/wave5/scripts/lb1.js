const M = 'b4848bdf-9f59-45a9-8336-9f4f2a4fc36b', L = '04c3cdbe-8cb0-49ba-bf49-f595bccab842';
await page.goto(H + `/modules/${M}/records/new?layout=${L}`, { waitUntil: 'domcontentloaded' }); await sleep(5000);
await page.locator('a, button', { hasText: 'Edit Page Layout' }).first().click(); await sleep(7000);
await shot('lb-open');
return { url: page.url().replace(H, ''), text: (await page.innerText('body')).replace(/\s+/g, ' ').slice(0, 2500) };
