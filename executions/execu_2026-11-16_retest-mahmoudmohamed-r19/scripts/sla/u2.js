await page.goto(H+'/settings/organization/email-templates',{waitUntil:'domcontentloaded'});await sleep(8000);
log(page.url());const t=await text();log(t.slice(0,1500));
const s=await page.$('input[type=search], input[placeholder*="earch"]');log('search',!!s);
if(s){await s.fill('QA RT19 SLA Tpl 2834 resp');await sleep(3000);}
await shot('2834-0-explore.png');
const row=page.locator('tr, [role=row]').filter({hasText:'QA RT19 SLA Tpl 2834 resp'}).first();log('rows',await row.count());
if(await row.count()){log(await row.innerHTML().then(h=>h.slice(0,2500)));}
