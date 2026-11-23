const path=require('path');const {chromium}=require(path.join('D:/Software Testing/Automation/Agentex Installation/Agentex Installation','node_modules/playwright-core'));
(async()=>{const b=await chromium.launch({channel:'msedge',headless:false});const p=await (await b.newContext({viewport:{width:1280,height:900}})).newPage();const E=[];
p.on('console',m=>{if(['error','warning'].includes(m.type()))E.push(m.type()+' '+m.text().slice(0,160));});p.on('pageerror',e=>E.push('pageerror '+e.message.slice(0,160)));
await p.goto('http://127.0.0.1:5500/zoho.html');await p.waitForTimeout(25000);
const dom=await p.evaluate(()=>[...document.querySelectorAll('body *')].filter(e=>e.offsetWidth>0&&e.childElementCount<3).map(e=>e.tagName+'#'+e.id+'.'+String(e.className).slice(0,40)+' vis='+(e.offsetWidth>0)+' '+JSON.stringify(e.getBoundingClientRect()).slice(0,60)).slice(-15));
await p.screenshot({path:'../screenshots/raw/2751-side-zoho-site.png'});
let clicked='';await p.mouse.click(19,170);await p.waitForTimeout(15000);clicked='mouse';
const frames=p.frames().map(f=>f.url().replace(/\?.*/,'').slice(0,90));let inner='';for(const f of p.frames().slice(1))inner+=' | '+(await f.locator('body').innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,300);
await p.screenshot({path:'../screenshots/raw/2751-side-zoho-site-open.png'});console.log(JSON.stringify({E,dom,clicked,frames,inner},null,1));await b.close();})();
