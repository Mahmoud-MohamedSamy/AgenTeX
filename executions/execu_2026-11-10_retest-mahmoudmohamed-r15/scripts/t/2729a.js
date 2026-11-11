await page.goto(H + '/settings/blueprints', { waitUntil: 'domcontentloaded' });
for (let i=0;i<30;i++){ await sleep(2000); const t=await text(); if(!/Loading…/.test(t.slice(-300))) break; }
const t = await text(); log(t.slice(0, 3000));
const links = await page.$$eval('a', as => as.map(a => a.textContent.trim().slice(0,50) + ' => ' + a.getAttribute('href')).filter(s => /blueprint/i.test(s)));
log(links.slice(0,40));
