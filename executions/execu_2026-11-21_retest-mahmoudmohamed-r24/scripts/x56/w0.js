await page.goto(H + '/views/all/tickets/9ec8bdc5-2362-4386-a4cd-e5bee332d0c7', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 20; i++) { await sleep(3000); const t = await text(); if (t.length > 800) break; }
return { url: page.url().replace(/[?#].*/, ''), signin: /sign in|log in|password/i.test(await text()), len: (await text()).length };
