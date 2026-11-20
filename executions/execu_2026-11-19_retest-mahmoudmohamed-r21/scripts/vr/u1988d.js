await page.goto(H+'/settings/modules-and-fields/88e8ea44-1658-4df3-9930-d0902b91073d/layouts/913b2c84-f235-404d-b563-c2cfa9566b6a',{waitUntil:'domcontentloaded'}); await page.getByText('Ticket Information').first().waitFor({timeout:90000}); await sleep(5000);
const lab=page.getByText('Priority',{exact:true}).first(); await lab.scrollIntoViewIfNeeded(); await lab.hover(); await sleep(600);
const fo=lab.locator('xpath=ancestor::*[.//button[@aria-label="Field options"]][1]//button[@aria-label="Field options"]').first(); await fo.click({force:true}); await sleep(1000);
await page.getByText('Edit Properties',{exact:true}).last().click(); await sleep(2500);
const panel=page.getByText('Field Properties',{exact:true}).first().locator('xpath=ancestor::*[.//button[normalize-space()="Apply"]][1]');
for(const tab of ['GENERAL','VALIDATION','PERMISSIONS','ADVANCED']){ const t=panel.getByText(tab,{exact:true}).first(); if(await t.count()){ await t.click(); await sleep(1500);} log(tab, (await panel.innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,1500)); await shot('1988-p-'+tab.toLowerCase()+'.png'); }
await panel.getByRole('button',{name:/^Cancel$/}).click().catch(()=>{});
