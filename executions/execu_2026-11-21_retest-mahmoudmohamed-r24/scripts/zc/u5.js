const {R,M,toList}=require('./lib.js');
const msgs=async page=>M(await page.innerText('body')).split('\n').filter(s=>/cannot|invalid|error|success|updated|required|enter|select|plan|depart/i.test(s)).slice(0,20);
module.exports=async(page,z)=>{await toList(page);let t='';const o={};const resp=[];
page.on('response',r=>{const m=r.request().method();if(/contracts/i.test(r.url())&&m!=='GET')resp.push(m+' '+r.status()+' '+r.url().replace(/\?.*/,'').slice(-70));});
await page.getByText('QA RT20 ZC C1').first().click({timeout:15000});for(let k=0;k<20;k++){await page.waitForTimeout(1500);t=await page.innerText('body');if(/Plan A/.test(t))break;}
await page.waitForTimeout(2000);await page.mouse.click(1427,80);await page.waitForTimeout(1500);await page.getByText('Edit',{exact:true}).first().click();await page.waitForTimeout(5000);
await page.mouse.click(360,214);await page.waitForTimeout(1500);await page.mouse.click(270,256);await page.waitForTimeout(3000);
await page.mouse.click(75,847);await page.waitForTimeout(3000);await page.screenshot({path:R+'ZC-2841-9-edit-tech-save-empty.png'});o.save1=await msgs(page);o.resp1=[...resp];
await page.mouse.click(755,472);await page.waitForTimeout(3000);await page.screenshot({path:R+'ZC-2841-10-edit-tech-plan-picker.png'});
o.picker=M(await page.innerText('body')).split('\n').filter(s=>/Plan|QA RT/.test(s)).slice(0,20);
const pb=page.getByText('QA RT20 ZC Plan B',{exact:true});o.pbCount=await pb.count();
if(o.pbCount){await pb.first().click();await page.waitForTimeout(2000);
 const sel=page.getByText(/^(Select|Done|Apply|Associate|Add)$/);if(await sel.count()){await sel.last().click().catch(()=>{});await page.waitForTimeout(2000);}
 await page.screenshot({path:R+'ZC-2841-11-edit-tech-planB.png'});
 await page.mouse.click(75,847);await page.waitForTimeout(4000);await page.screenshot({path:R+'ZC-2841-12-edit-tech-planB-save.png'});o.save2=await msgs(page);}
o.resp=resp;const g=await z('GET','/api/v1/contracts/1499272000000485400');o.api=g.s+' dept='+g.j?.departmentId+' plan='+(g.j?.supportPlan?.name);
return o;};
