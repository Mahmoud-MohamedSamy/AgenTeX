await page.goto(H+'/settings/modules-and-fields/841043e1-c078-41f9-8d6e-dfd61bee45c3',{waitUntil:'domcontentloaded'}); await sleep(15000);
const main=await page.locator('main').innerText().catch(()=>''); log(main.slice(0,900));
const links=await page.$$eval('main a, main button',as=>as.filter(a=>a.offsetParent).map(a=>a.innerText.trim().replace(/\n/g,' ').slice(0,40)+' -> '+(a.getAttribute('href')||'')).slice(0,40)); log(links);
await shot('2865-leads-module.png'); return {};
