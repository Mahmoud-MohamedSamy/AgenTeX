const path=require('path');const {chromium}=require(path.join('D:/Software Testing/Automation/Agentex Installation/Agentex Installation','node_modules/playwright-core'));
(async()=>{const b=await chromium.launch({channel:'msedge',headless:false});const p=await (await b.newContext({viewport:{width:1280,height:900}})).newPage();const L=[];
p.on('response',r=>{const u=r.url();if(/zoho/.test(u)&&!/\.(png|svg|woff2?|css|gif)(\?|$)/.test(u))L.push(r.request().method()+' '+u.replace(/\?.*/,'').slice(0,90)+' → '+r.status());});
await p.goto('http://127.0.0.1:5500/zoho.html');await p.waitForTimeout(15000);
const fr=p.frames().map(f=>f.url().replace(/\?.*/,'').slice(0,80));const txt=(await p.locator('body').innerText()).replace(/\s+/g,' ').slice(0,300);
await p.screenshot({path:'../screenshots/raw/2751-side-zoho-site.png'});
// try opening the popout tab
const tab=p.getByText(/Feedback/).last();let opened=false;if(await tab.count()){await tab.click().catch(()=>{});await p.waitForTimeout(8000);opened=true;}
let inner='';for(const f of p.frames())inner+=' | '+(await f.locator('body').innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,200);
await p.screenshot({path:'../screenshots/raw/2751-side-zoho-site-open.png'});
console.log(JSON.stringify({L:L.slice(0,15),frames:fr,txt,opened,inner:inner.slice(0,900)},null,1));await b.close();})();
