const path=require('path'),fs=require('fs');const P='D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const S='C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/64533306-cf5e-4d09-aa5c-24702973a047/scratchpad/'+(process.env.ZS||'r18-z3')+'.json';
const {chromium}=require(path.join(P,'node_modules/playwright-core'));
(async()=>{const b=await chromium.launch({headless:false,channel:'msedge'});const ctx=await b.newContext({storageState:S,viewport:{width:1600,height:900}});const pg=await ctx.newPage();
const u=process.argv[2], out=process.argv[3];
await pg.goto(u,{waitUntil:'domcontentloaded',timeout:90000});await pg.waitForTimeout(25000);
await pg.screenshot({path:out});console.log(pg.url().slice(0,120));console.log((await pg.innerText('body')).slice(0,2500));await b.close();})().catch(e=>{console.error('ERR',e.message.split('\n')[0]);process.exit(1)});
