await page.goto(H + '/activities', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(2000); if (/Task|Call/.test(await text()) && (await text()).length > 600) break; } await sleep(3000);
log((await text()).slice(0, 1500));
log(await page.$$eval('button', bs => bs.map(b => (b.innerText || b.getAttribute('aria-label') || '').trim()).filter(Boolean).slice(0, 60)));
await shot('2635-activities.png');
