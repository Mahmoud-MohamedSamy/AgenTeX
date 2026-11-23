const T='88e8ea44-1658-4df3-9930-d0902b91073d';
await page.goto(H+'/settings/modules-and-fields/'+T+'?tab=map-dependency',{waitUntil:'domcontentloaded'}); await page.getByText('Map Dependency',{exact:false}).first().waitFor({timeout:90000}); await sleep(6000);
log('dep', (await text()).replace(/\s+/g,' ').slice(0,1500)); await shot('1988-5-mapdep-list.png');
const nb=page.getByRole('button',{name:/new|add|create/i}).filter({hasNotText:/^$/}); log('btns', await page.getByRole('button').allInnerTexts().then(a=>a.map(s=>s.trim()).filter(Boolean).slice(-15)));
await page.goto(H+'/settings/modules-and-fields/'+T+'?tab=layouts',{waitUntil:'domcontentloaded'}); await sleep(8000);
log('layouts', (await text()).replace(/\s+/g,' ').slice(0,1200)); log('links', await page.locator('a').evaluateAll(es=>es.map(e=>e.getAttribute('href')).filter(h=>/layout/i.test(h||'')).slice(0,20)));
await shot('1988-0-layouts.png');
