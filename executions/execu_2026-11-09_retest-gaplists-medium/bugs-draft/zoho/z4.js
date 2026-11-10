// Read-only tour: departments, tickets, activities. No form is submitted.
const path=require('path');const P='D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const {chromium}=require(path.join(P,'node_modules/playwright-core'));
const txt=async p=>(await p.innerText('body')).replace(/\s+/g,' ');
(async()=>{const b=await chromium.launch({headless:false,channel:'msedge'});
const ctx=await b.newContext({storageState:process.env.ST,viewport:{width:1600,height:900}});const page=await ctx.newPage();
const api=async u=>page.evaluate(async u=>{const r=await fetch(u,{credentials:'include'});return r.status+' '+(await r.text()).slice(0,1500)},u);
await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/allDepartment/tickets/list/all-cases',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(15000);
console.log(page.url());console.log((await txt(page)).slice(0,700));
await page.screenshot({path:'raw/tickets-all-depts.png'});
await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/allDepartment/activities/list/all-activities',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(15000);
console.log(page.url());console.log((await txt(page)).slice(0,900));
await page.screenshot({path:'raw/activities-all-depts.png'});
await b.close();})().catch(e=>{console.error('ERR',e.message);process.exit(1)});
