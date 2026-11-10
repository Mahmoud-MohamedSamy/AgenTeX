// Read-only: open Zoho Desk setup pages by hash; reload if the page errors; screenshot + text for each.
const path=require('path');const P='D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const {chromium}=require(path.join(P,'node_modules/playwright-core'));
const pages=JSON.parse(process.argv[2]);
(async()=>{const b=await chromium.launch({headless:false,channel:'msedge'});
const ctx=await b.newContext({storageState:process.env.ST,viewport:{width:1600,height:900}});const page=await ctx.newPage();
const w=[];page.on('request',r=>{if(['PUT','PATCH','DELETE'].includes(r.method()))w.push(r.method()+' '+r.url().slice(0,90))});
for(const [name,url] of pages){
 let ok=false;
 for(let a=0;a<3&&!ok;a++){
  await page.goto(url,{waitUntil:'commit',timeout:120000}).catch(()=>{});
  for(let i=0;i<10;i++){await page.waitForTimeout(4000);const t=await page.innerText('body').catch(()=>'');if(/caused an error/.test(t))break;if(t.replace(/\s+/g,'').length>300){ok=true;break;}}
 }
 await page.waitForTimeout(4000);
 const nn=page.locator('text=/^Not Now$/');if(await nn.count())await nn.first().click().catch(()=>{});
 await page.screenshot({path:`raw/${name}.png`});
 console.log('==',name,ok,page.url().slice(0,140));
 console.log((await page.innerText('body').catch(()=>'')).replace(/\s+/g,' ').slice(0,1800));
}
console.log('writes',JSON.stringify(w));
await b.close();})().catch(e=>{console.error('ERR',e.message);process.exit(1)});
