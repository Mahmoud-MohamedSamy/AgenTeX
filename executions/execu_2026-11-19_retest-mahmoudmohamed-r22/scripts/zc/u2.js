const {R,M,ready}=require('./lib.js');
module.exports=async(page)=>{await ready(page,/NEW RELEASE|Contract Name/);let t='';
for(let a=0;a<3;a++){await page.getByText('Tickets',{exact:true}).first().click().catch(()=>{});await page.waitForTimeout(5000);await page.getByText('Contracts',{exact:true}).first().click().catch(()=>{});
for(let k=0;k<15;k++){await page.waitForTimeout(2000);t=await page.innerText('body');if(/QA RT20 ZC C1/.test(t))break;}if(/QA RT20 ZC C1/.test(t))break;}
await page.screenshot({path:R+'ZC-2841-0-list.png'});
await page.getByText('QA RT20 ZC C1').first().click({timeout:15000});for(let k=0;k<20;k++){await page.waitForTimeout(1500);t=await page.innerText('body');if(/Plan A/.test(t))break;}
await page.waitForTimeout(2500);await page.screenshot({path:R+'ZC-2841-1-detail.png'});
const btns=await page.$$eval('button,[role=button],a',els=>els.map(e=>(e.innerText||e.title||e.getAttribute('aria-label')||'').trim()).filter(Boolean).slice(0,120));
return page.url()+'\n'+M(t).slice(0,2500)+'\nBTNS '+btns.join('|');};
