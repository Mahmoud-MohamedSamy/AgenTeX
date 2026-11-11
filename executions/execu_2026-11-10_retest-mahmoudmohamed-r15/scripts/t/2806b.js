await page.goto(H + '/settings/blueprints', { waitUntil: 'domcontentloaded' }); await page.getByText('Pipeline+Blueprint').first().waitFor({timeout:120000});
const t = await text(); log(t.slice(0, 200));
const items = await page.$$eval('nav a, aside a, [role=navigation] a', as => [...new Set(as.map(a => a.getAttribute('href') + ' ' + a.textContent.trim().slice(0,30)))]); log(items);
const sb = await page.$$eval('a', as => as.filter(a=>/settings/.test(a.getAttribute('href')||'')).map(a=>a.getAttribute('href'))); log(sb);
