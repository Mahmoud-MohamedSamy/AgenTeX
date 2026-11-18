await page.goto(H+'/settings/modules-and-fields',{waitUntil:'domcontentloaded'}); await sleep(6000);
await page.getByRole('tab',{name:/global sets/i}).first().click().catch(async()=>{await page.getByText(/^Global Sets$/).first().click();}); await sleep(4000);
const t=await text(); log(t.slice(t.indexOf('Global Set')>0?t.indexOf('Global Set'):0).slice(0,2500));
await shot('2870-1-list.png');
const links=await page.$$eval('table a, [role=row] a, td button', as=>as.map(a=>a.tagName+':'+a.innerText.trim()).filter(x=>x.length>4).slice(0,40)); log('links',links);
return {url:page.url()};
