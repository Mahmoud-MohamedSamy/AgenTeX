await page.goto(H + '/hq', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(2000); if (/Tickets/.test(await text())) break; } await sleep(2000);
await page.getByRole('button', { name: 'Settings' }).click(); await sleep(6000);
log(page.url()); const t = await text(); log(t.slice(0, 2500));
log(await page.$$eval('a[href]', as => [...new Set(as.map(a => a.getAttribute('href')))].slice(0, 120)));
