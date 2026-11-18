const path=require('path');const P='D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const S='C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/64533306-cf5e-4d09-aa5c-24702973a047/scratchpad/r18-z3.json';
const {chromium}=require(path.join(P,'node_modules/playwright-core'));
(async()=>{const b=await chromium.launch({headless:false,channel:'msedge'});const ctx=await b.newContext({storageState:S,viewport:{width:1600,height:900}});const pg=await ctx.newPage();
await pg.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/setup',{waitUntil:'domcontentloaded',timeout:90000});await pg.waitForTimeout(15000);
console.log(pg.url());const links=await pg.$$eval('a',as=>as.map(a=>a.innerText.trim()+' | '+a.getAttribute('href')).filter(s=>/audit|depart|history|log/i.test(s)));console.log(links.join('\n'));
await pg.screenshot({path:'../screenshots/raw/z-setup.png'});await b.close();})().catch(e=>{console.error('ERR',e.message.split('\n')[0]);process.exit(1)});
