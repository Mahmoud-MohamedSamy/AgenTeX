const path=require('path');const P='D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const S='C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/64533306-cf5e-4d09-aa5c-24702973a047/scratchpad/r18-z3.json';
const {chromium}=require(path.join(P,'node_modules/playwright-core'));
(async()=>{const b=await chromium.launch({headless:false,channel:'msedge'});const ctx=await b.newContext({storageState:S,viewport:{width:1600,height:900}});const pg=await ctx.newPage();
const reqs=[];pg.on('response',async r=>{const u=r.url();if(/desk\.zoho\.com\/(api|supportapi)[^?]*\/(tickets|departments|myinfo)/.test(u)&&!/iam|accounts/.test(u))reqs.push(r.status()+' '+u.replace(/[?].*/,'').slice(0,140));});
await pg.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/tickets/list/all-cases',{waitUntil:'domcontentloaded',timeout:90000});await pg.waitForTimeout(25000);
await pg.screenshot({path:'../screenshots/raw/z-tix.png'});console.log([...new Set(reqs)].slice(0,15).join('\n'));console.log((await pg.innerText('body')).slice(0,1500));await b.close();})().catch(e=>{console.error('ERR',e.message.split('\n')[0]);process.exit(1)});
