await page.goto(H + '/settings/modules-and-fields', { waitUntil: 'domcontentloaded' }); for (let i=0;i<30;i++){ await sleep(2000); if (/Customers/.test((await text()).slice(1500))) break; }
const row = page.locator('tr', { hasText: 'Leads' }).first(); await row.locator('button, a').first().click().catch(()=>row.click()); await sleep(6000);
log(page.url()); const t = await text(); log(t.slice(t.indexOf('Leads', 1500), t.indexOf('Leads',1500)+1200));
const lay = page.getByText('Standard', {exact:true}).first(); if (await lay.count()) { await lay.click(); await sleep(8000); log(page.url()); }
await shot('2806-layout.png');
