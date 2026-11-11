await page.goto(H + '/hq', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(2000); if ((await text()).length > 200) break; }
log(page.url()); const t = await text(); log(t.slice(0, 800));
const links = await page.$$eval('a[href]', as => [...new Set(as.map(a => a.getAttribute('href')))].slice(0, 60)); log(links);
await shot('2635-nav.png');
