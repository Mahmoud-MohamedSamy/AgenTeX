// Read-only: open Add Task form, read department + owner pickers, then close without saving.
const path=require('path');const P='D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const {chromium}=require(path.join(P,'node_modules/playwright-core'));
const txt=async p=>(await p.innerText('body')).replace(/\s+/g,' ');
(async()=>{const b=await chromium.launch({headless:false,channel:'msedge'});
const ctx=await b.newContext({storageState:process.env.ST,viewport:{width:1600,height:900}});const page=await ctx.newPage();
await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/tasks/new',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(15000);
console.log(page.url());console.log((await txt(page)).slice(0,1200));
await page.screenshot({path:'raw/task-new.png'});
const ins=await page.$$eval('input,textarea,select',els=>els.filter(e=>e.offsetParent).map(e=>[e.tagName,e.getAttribute('data-id'),e.value,e.placeholder].join('|')));
console.log(ins.join('\n'));
await b.close();})().catch(e=>{console.error('ERR',e.message);process.exit(1)});
