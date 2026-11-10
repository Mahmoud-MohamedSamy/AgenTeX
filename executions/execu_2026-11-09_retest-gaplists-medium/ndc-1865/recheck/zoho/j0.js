const path=require('path');const P='D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const {chromium}=require(path.join(P,'node_modules/playwright-core'));
(async()=>{const b=await chromium.launch({headless:false,channel:'msedge'});
const ctx=await b.newContext({storageState:process.env.ST,viewport:{width:1600,height:900}});const page=await ctx.newPage();
await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/tickets/list/all-tickets',{waitUntil:'commit',timeout:90000});
await page.waitForTimeout(15000);console.log(page.url().slice(0,120));
console.log((await page.innerText('body').catch(()=>'')).slice(0,200).replace(/\s+/g,' '));
await b.close();})().catch(e=>{console.error('ERR',e.message);process.exit(1)});
