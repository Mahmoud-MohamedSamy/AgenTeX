const path=require('path');const P='D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const {chromium}=require(path.join(P,'node_modules/playwright-core'));
const D=P+'/executions/execu_2026-11-09_retest-gaplists-medium/ndc-1865/bugs-draft/raw/zoho/';
const Z='https://desk.zoho.com/agent/techsolutionsegypt/tech/';
(async()=>{const b=await chromium.launch({headless:false,channel:'msedge'});
const ctx=await b.newContext({storageState:process.env.ST,viewport:{width:1600,height:900}});const page=await ctx.newPage();const out={};
const body=()=>page.locator('body').innerText().catch(()=>'');
const wt=async(re,ms=60000)=>{const t0=Date.now();while(Date.now()-t0<ms){const t=await body();if(re.test(t))return t;await page.waitForTimeout(2000);}return null;};
const writes=[];page.on('request',r=>{if(!['GET','OPTIONS'].includes(r.method())&&/desk\.zoho\.com\/(api|supportapi)/.test(r.url())&&!/log|track|stats|presence|notif/i.test(r.url()))writes.push(r.method()+' '+r.url().replace(/\?.*/,'').slice(-80));});
await page.goto(Z+'tickets/list/all-cases',{waitUntil:'domcontentloaded',timeout:90000});await wt(/All Tickets/i,90000);await page.waitForTimeout(8000);
const nn=page.locator('text=/^Not Now$/');if(await nn.count())await nn.first().click().catch(()=>{});
await page.screenshot({path:D+'b-list.png'});
// open first ticket link
const links=page.locator('a[href*="/tickets/details/"]');out.links=await links.count();
if(out.links){await links.first().click();await page.waitForTimeout(10000);out.url=page.url().slice(-60);
 const t=await body();out.contact=t.split('\n').filter(l=>/@/.test(l)).slice(0,5);await page.screenshot({path:D+'b-ticket.png'});
 const ra=page.locator('text=/^Reply All$/').first();const rp=page.locator('text=/^Reply$/').first();
 for(const [btn,name] of [[rp,'b-zoho-reply'],[ra,'b-zoho-replyall']]){if(await btn.count()){await btn.click({force:true});await page.waitForTimeout(6000);await page.screenshot({path:D+name+'.png'});const tt=await body();const i=tt.search(/\bTo\b/);out[name]=tt.slice(Math.max(0,i-80),i+300).replace(/\n+/g,' | ').slice(0,350);
   // close composer without typing
   const x=page.locator('[data-id*="close" i],[aria-label*="Close" i],[title*="Discard" i],[title*="Close" i]').filter({hasNotText:/Desktop/}).last();
   await page.keyboard.press('Escape');await page.waitForTimeout(2000);const disc=page.locator('text=/^(Discard|Discard Draft|Yes)$/i').first();if(await disc.count()){await disc.click().catch(()=>{});out[name+'-discard']=true;}await page.waitForTimeout(2000);}}}
// Audit log
await page.goto(Z+"setup",{waitUntil:"domcontentloaded",timeout:90000});await page.waitForTimeout(10000);const al=page.locator("text=/^Audit Log$/").first();out.al=await al.count();if(out.al){await al.scrollIntoViewIfNeeded().catch(()=>{});await al.click({force:true});await page.waitForTimeout(12000);await page.screenshot({path:D+"k2-audit-log.png"});out.audit=(await body()).split("\n").filter(l=>/export|audit|action|filter/i.test(l)).slice(0,20);}
out.writes=writes;console.log(JSON.stringify(out,null,1));await b.close();})().catch(e=>{console.error('ERR',e.message);process.exit(1)});
