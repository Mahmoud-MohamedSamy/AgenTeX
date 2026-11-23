const R={};await page.goto(H+'/settings/automation/sla',{waitUntil:'domcontentloaded'});
for(let i=0;i<40;i++){await sleep(3000);const t=await page.locator('#main-content').innerText().catch(()=>'');if(/SLA/i.test(t)&&!/Loading/.test(t))break;}await sleep(3000);
R.text=(await page.locator('#main-content').innerText()).replace(/\s+/g,' ').slice(0,1500);await shot('sla-settings.png');
const reqs=[];return R;
