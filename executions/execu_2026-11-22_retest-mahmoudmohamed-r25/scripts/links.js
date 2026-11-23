const path=require('path');const P='D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const S='C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/14f7a636-ad22-4c58-b83c-7b2ea2e79885/scratchpad';
const {chromium}=require(path.join(P,'node_modules/playwright-core'));
(async()=>{const b=await chromium.launch({headless:true,channel:'msedge'});const ctx=await b.newContext({storageState:S+'/r18-o.json'});const pg=await ctx.newPage();
await pg.goto('https://staging-desk.taviportal.com/'+process.argv[2],{waitUntil:'commit'});await pg.waitForTimeout(15000);console.log(pg.url());
console.log([...new Set(await pg.$$eval('a',a=>a.map(x=>x.getAttribute('href')+' | '+x.innerText.trim().slice(0,30))))].filter(x=>new RegExp(process.argv[3]||'mail|channel','i').test(x)).join('\n'));await b.close();})();
