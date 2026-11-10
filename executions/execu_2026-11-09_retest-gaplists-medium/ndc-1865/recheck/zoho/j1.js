// Read-only: open Zoho Desk Setup and list links for templates, departments, CRM integration. Logs any write requests.
const path=require('path');const P='D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const {chromium}=require(path.join(P,'node_modules/playwright-core'));
(async()=>{const b=await chromium.launch({headless:false,channel:'msedge'});
const ctx=await b.newContext({storageState:process.env.ST,viewport:{width:1600,height:900}});const page=await ctx.newPage();
const w=[];page.on('request',r=>{if(['POST','PUT','PATCH','DELETE'].includes(r.method()))w.push(r.method()+' '+r.url().slice(0,90))});
await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/setup',{waitUntil:'commit',timeout:120000});
await page.waitForTimeout(20000);console.log(page.url());
await page.screenshot({path:'raw/j1-setup.png'});
const links=await page.$$eval('a',as=>as.map(a=>[a.innerText.trim().replace(/\s+/g,' '),a.getAttribute('href')]).filter(x=>x[0]&&x[1]));
for(const [t,h] of links) console.log(t,'|',h);
console.log('writes',JSON.stringify(w));
await b.close();})().catch(e=>{console.error('ERR',e.message);process.exit(1)});
