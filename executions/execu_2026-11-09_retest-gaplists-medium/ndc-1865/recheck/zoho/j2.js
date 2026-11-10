// Read-only: load Zoho Desk Setup fully, dump all setup links and visible text.
const path=require('path');const P='D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const {chromium}=require(path.join(P,'node_modules/playwright-core'));
(async()=>{const b=await chromium.launch({headless:false,channel:'msedge'});
const ctx=await b.newContext({storageState:process.env.ST,viewport:{width:1600,height:900}});const page=await ctx.newPage();
const w=[];page.on('request',r=>{if(['PUT','PATCH','DELETE'].includes(r.method())||(r.method()==='POST'&&!/log|track|stat|beacon|metric|collect/i.test(r.url())))w.push(r.method()+' '+r.url().slice(0,90))});
await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/setup',{waitUntil:'commit',timeout:120000});
for(let i=0;i<12;i++){await page.waitForTimeout(5000);const n=await page.$$eval('a[href*="setup"]',a=>a.length).catch(()=>0);if(n>15)break;}
await page.screenshot({path:'raw/j2-setup.png'});
const links=await page.$$eval('a',as=>as.map(a=>[a.innerText.trim().replace(/\s+/g,' '),a.getAttribute('href')]).filter(x=>x[0]&&x[1]&&/setup/.test(x[1])));
for(const [t,h] of links) console.log(t,'|',h);
console.log('TEXT',(await page.innerText('body')).replace(/\s+/g,' ').slice(0,1500));
console.log('writes',JSON.stringify(w));
await b.close();})().catch(e=>{console.error('ERR',e.message);process.exit(1)});
