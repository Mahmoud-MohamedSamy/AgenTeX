const fs=require('fs');const L=JSON.parse(fs.readFileSync('../out/lead.json','utf8'));const o={};const S='../screenshots/';const CRM='https://staging-crm.taviportal.com';await page.setViewportSize({width:1600,height:1000});
const txt=async()=>(await page.innerText('body').catch(()=>'')).replace(/\s+/g,' ');
await page.goto(CRM+'/modules/'+L.module+'/records/'+L.id,{waitUntil:'commit',timeout:180000});
for(let i=0;i<50;i++){await page.waitForTimeout(3000);if(/Send Email/.test(await txt()))break;}
const clickTab=async n=>{const c=page.locator('main').getByText(n,{exact:true}).first();await c.click({timeout:15000});await page.waitForTimeout(7000);};
await clickTab('Emails');const t=await page.locator('main').innerText().catch(()=>'');const i=t.indexOf('QA RT13 2630 ',t.indexOf('Emails'));o.emailsText=t.replace(/\s+/g,' ').match(/.{0,120}(screen failure check).{0,350}/)?.[0]||t.replace(/\s+/g,' ').slice(-500);await page.screenshot({path:S+'t4-emails-tab.png'});
await clickTab('Timeline');o.timelineText=(await page.locator('main').innerText().catch(()=>'')).replace(/\s+/g,' ').match(/Timeline.{0,500}/g)?.slice(-1)[0];await page.screenshot({path:S+'t5-timeline-tab.png'});
const n=await page.getByRole('button',{name:'Notifications'}).first();return o;
