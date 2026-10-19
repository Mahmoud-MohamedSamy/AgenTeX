await page.goto(H + '/workqueue', { waitUntil: 'load', timeout: 90000 }); await sleep(10000); await shot('_peek');
return done({ url: page.url(), ck: (await page.context().cookies()).map(c => c.name), body: (await txt()).slice(0, 200) });
