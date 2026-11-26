// node zs-step.js <state> <shotName> [url] [clickText]  open (or reuse) social, optional click, screenshot + text. Saves state back to a COPY only.
const path=require('path');const P='D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const {chromium}=require(path.join(P,'node_modules/playwright-core'));
(async()=>{const [st,shot,url,click]=process.argv.slice(2);const b=await chromium.launch({headless:false,channel:'msedge'});
const ctx=await b.newContext({storageState:st,viewport:{width:1600,height:900}});const page=await ctx.newPage();
await page.goto(url||'https://social.zoho.com/',{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});await page.waitForTimeout(12000);
if(click){await page.locator(`text=${click}`).first().click({timeout:15000});await page.waitForTimeout(20000);}
console.log('URL',page.url().slice(0,140));await page.screenshot({path:path.join(path.dirname(st),'shots',shot+'.png')});
console.log((await page.innerText('body').catch(()=>'')).slice(0,3000));
await ctx.storageState({path:st.replace('.json','-2.json')});await b.close();})().catch(e=>{console.error('ERR',e.message.split('\n')[0]);process.exit(1);});
