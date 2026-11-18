// keeps Test User 1 online in a headless Edge for N seconds (own state, saved back at end)
const path=require('path');const P='D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const ST='C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/64533306-cf5e-4d09-aa5c-24702973a047/scratchpad/r19-wf-tu1.json';
const {chromium}=require(path.join(P,'node_modules/playwright-core'));
(async()=>{const b=await chromium.launch({headless:true,channel:'msedge'});const ctx=await b.newContext({storageState:ST,viewport:{width:1600,height:900}});const p=await ctx.newPage();
await p.goto('https://staging-desk.taviportal.com/hq',{waitUntil:'domcontentloaded',timeout:120000});
const N=+process.argv[2]||300;for(let i=0;i<N/10;i++){await p.waitForTimeout(10000);await p.mouse.move(100+i%50,200);if(i%3===0){const r=await p.evaluate(async()=>{try{return (await fetch('/api/v1/desk/agents/me/presence',{headers:{'x-app-key':'desk','x-tenant-id':'a7a7a7a7-0000-0000-0000-000000000004'},credentials:'include'})).status}catch(e){return 'x'}});console.log(new Date().toISOString().slice(11,19),'presence GET',r);}}
await ctx.storageState({path:ST});await b.close();})().catch(e=>{console.error('ERR',String(e.message).slice(0,200));process.exit(1);});
