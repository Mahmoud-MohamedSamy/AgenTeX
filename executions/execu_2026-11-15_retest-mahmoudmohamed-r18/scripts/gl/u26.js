await page.goto(H+'/settings/customization/notifications',{waitUntil:'domcontentloaded'}); await sleep(12000);
const sel=page.locator('main select').first(); if(await sel.count()) { await sel.selectOption({label:'Marketing'}).catch(()=>{}); } else { await page.getByRole('combobox').first().click().catch(()=>{}); await sleep(800); await page.getByRole('option',{name:'Marketing'}).click().catch(()=>{}); }
await sleep(6000);
const t=(await page.locator('main').last().innerText()).replace(/\s+/g,' '); const i=t.indexOf('Which automatic');
await shot('3000-1-notifications-marketing.png');
return t.slice(i,i+1500);
