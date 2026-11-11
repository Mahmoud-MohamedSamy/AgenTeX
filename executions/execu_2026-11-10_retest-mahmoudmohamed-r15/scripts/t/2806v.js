await page.goto(H + '/settings/modules-and-fields/841043e1-c078-41f9-8d6e-dfd61bee45c3?tab=layouts', { waitUntil: 'domcontentloaded' }); for (let i=0;i<30;i++){ await sleep(2000); if (/Standard/.test((await text()).slice(2000))) break; }
await page.locator('tr', { hasText: 'Standard' }).filter({hasNotText:'Layout SG'}).last().getByText('Standard', {exact:true}).click(); await sleep(10000); log(page.url());
for (let i=0;i<20;i++){ await sleep(2000); if (/Lead Source/.test(await text())) break; }
const ls = page.getByText('Lead Source', {exact:true}).first(); await ls.hover(); await sleep(800);
const box = ls.locator('xpath=ancestor::*[.//button][1]'); const bl = await box.locator('button').evaluateAll(bs=>bs.map(b=>b.getAttribute('aria-label')||b.innerText.trim())); log('btns', bl);
await shot('2806-layout-ls.png');
