await page.goto(H + '/', { waitUntil: 'domcontentloaded' }); await sleep(6000);
log('url', page.url());
// find route to layout builder for QA FX
await page.goto(H + '/settings/modules', { waitUntil: 'domcontentloaded' }); await sleep(6000); log('url2', page.url()); const t = await text('main'); log(t.slice(0, 600));
await shot('u0-modules');
const links = await page.$$eval('a', as => as.map(a => a.getAttribute('href')).filter(h => h && /module|layout|setting/i.test(h)).slice(0, 40)); log(links);
