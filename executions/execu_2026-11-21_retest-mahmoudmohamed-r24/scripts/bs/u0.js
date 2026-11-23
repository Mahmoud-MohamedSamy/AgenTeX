await page.goto(H + '/views/all/tickets', { waitUntil: 'domcontentloaded' }); await sleep(12000);
return { url: page.url().replace(/\?.*/, ''), t: (await text()).slice(0, 300) };
