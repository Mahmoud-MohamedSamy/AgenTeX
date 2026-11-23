const R={};await page.goto(H+'/settings/automation/sla',{waitUntil:'domcontentloaded'});
for(let i=0;i<40;i++){await sleep(3000);if(await page.getByText('SLA Policies').count())break;}await sleep(3000);
for(const d of ['QA RT26 VO Dept','QA AO Dept A','QA NDC Accounting']){
 const dd=page.getByText('Department',{exact:true}).first().locator('xpath=following::button[1]');await dd.click();await sleep(1200);
 const s=page.locator('input[placeholder*="Search" i]:visible').last();if(await s.count()){await s.fill(d);await sleep(800);}
 await page.getByRole('option',{name:d}).first().click().catch(async()=>{await page.getByText(d,{exact:true}).last().click();});await sleep(4000);
 R[d]=(await page.locator('#main-content').innerText()).replace(/\s+/g,' ').split('SLA Policies')[1]?.slice(0,700);await shot('sla-settings-'+d.replace(/\W+/g,'-')+'.png');}
return R;
