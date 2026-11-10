// Read-only: Activities tab and department switcher. Nothing is submitted.
const path=require('path');const P='D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const {chromium}=require(path.join(P,'node_modules/playwright-core'));
const txt=async p=>(await p.innerText('body')).replace(/\s+/g,' ');
(async()=>{const b=await chromium.launch({headless:false,channel:'msedge'});
const ctx=await b.newContext({storageState:process.env.ST,viewport:{width:1600,height:900}});const page=await ctx.newPage();
await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/tickets/list/all-cases',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(14000);
await page.getByText('Activities',{exact:true}).first().click();await page.waitForTimeout(8000);
console.log(page.url());console.log((await txt(page)).slice(0,900));
await page.screenshot({path:'raw/activities-tech.png'});
// department switcher (the "Tech" label in the top bar)
const sw=page.getByText('Tech',{exact:true}).first();await sw.click().catch(e=>console.log('sw',e.message));await page.waitForTimeout(3000);
console.log('SWITCHER',(await txt(page)).slice(0,600));
await page.screenshot({path:'raw/dept-switcher.png'});
await b.close();})().catch(e=>{console.error('ERR',e.message);process.exit(1)});
