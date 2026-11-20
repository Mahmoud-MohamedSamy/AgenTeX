const {R,M,toList,formDump}=require('./lib.js');
module.exports=async(page)=>{await toList(page);let t='';const o={};
await page.getByText('QA RT20 ZC C1').first().click({timeout:15000});for(let k=0;k<20;k++){await page.waitForTimeout(1500);t=await page.innerText('body');if(/Plan A/.test(t))break;}
await page.waitForTimeout(2000);await page.mouse.click(1427,80);await page.waitForTimeout(1500);await page.getByText('Edit',{exact:true}).first().click();await page.waitForTimeout(5000);
await page.mouse.click(360,214);await page.waitForTimeout(2000);await page.screenshot({path:R+'ZC-2841-4-edit-dept-click.png'});
o.afterDeptClick=M(await page.innerText('body')).includes('Tech\n')||/\nTech$/m.test(await page.innerText('body'));
await page.mouse.move(334,187);await page.waitForTimeout(1500);await page.screenshot({path:R+'ZC-2841-5-edit-dept-lock.png'});
o.tipLock=await page.$$eval('[role=tooltip],[class*=tooltip],[class*=Tooltip]',e=>e.filter(x=>x.offsetParent).map(x=>x.innerText.trim()).filter(Boolean));
await page.mouse.move(340,527);await page.waitForTimeout(1500);await page.screenshot({path:R+'ZC-2841-6-edit-plan-info.png'});
o.tipInfo=await page.$$eval('[role=tooltip],[class*=tooltip],[class*=Tooltip]',e=>e.filter(x=>x.offsetParent).map(x=>x.innerText.trim()).filter(Boolean));
await page.mouse.move(359,527);await page.waitForTimeout(1500);o.tipPlanLock=await page.$$eval('[role=tooltip],[class*=tooltip],[class*=Tooltip]',e=>e.filter(x=>x.offsetParent).map(x=>x.innerText.trim()).filter(Boolean));await page.screenshot({path:R+'ZC-2841-7-edit-plan-lock.png'});
o.title=await page.$$eval('[title]',e=>e.filter(x=>x.offsetParent).map(x=>x.getAttribute('title')).filter(s=>/lock|edit|cannot|support|depart/i.test(s)));
await page.getByText('Cancel',{exact:true}).last().click().catch(()=>{});return o;};
