// Read-only: open tickets list, click the Setup gear, dump setup links.
const path=require('path');const P='D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const {chromium}=require(path.join(P,'node_modules/playwright-core'));
(async()=>{const b=await chromium.launch({headless:false,channel:'msedge'});
const ctx=await b.newContext({storageState:process.env.ST,viewport:{width:1600,height:900}});const page=await ctx.newPage();
const w=[];page.on('request',r=>{if(['PUT','PATCH','DELETE'].includes(r.method()))w.push(r.method()+' '+r.url().slice(0,90))});
await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/tickets/list/all-tickets',{waitUntil:'commit',timeout:120000});
await page.waitForTimeout(20000);
const nn=page.locator('text=/Not Now/');if(await nn.count())await nn.first().click().catch(()=>{});
await page.mouse.click(1461,24);
for(let i=0;i<12;i++){await page.waitForTimeout(5000);const t=await page.innerText('body').catch(()=>'');if(/Departments|Templates|Marketplace/.test(t))break;}
console.log(page.url());
await page.screenshot({path:'raw/j3-setup.png'});
const links=await page.$$eval('a',as=>as.map(a=>[a.innerText.trim().replace(/\s+/g,' '),a.getAttribute('href')]).filter(x=>x[0]&&x[1]&&/setup/.test(x[1])));
for(const [t,h] of links) console.log(t,'|',h);
console.log('TEXT',(await page.innerText('body')).replace(/\s+/g,' ').slice(0,2500));
console.log('writes',JSON.stringify(w));
await b.close();})().catch(e=>{console.error('ERR',e.message);process.exit(1)});
