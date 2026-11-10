const path=require('path');const P='D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const {chromium}=require(path.join(P,'node_modules/playwright-core'));
const D=P+'/executions/execu_2026-11-09_retest-gaplists-medium/ndc-1865/bugs-draft/raw/zoho/';
(async()=>{const b=await chromium.launch({headless:false,channel:'msedge'});
const ctx=await b.newContext({storageState:process.env.ST,viewport:{width:1600,height:900}});const page=await ctx.newPage();const out={};
const writes=[];page.on('request',r=>{if(!['GET','OPTIONS'].includes(r.method())&&/desk\.zoho\.com/.test(r.url())&&!/log|track|stats|presence|notif|markRecent|ulaa|collect/i.test(r.url()))writes.push(r.method()+' '+r.url().replace(/\?.*/,'').slice(-90));});
const body=()=>page.locator('body').innerText().catch(()=>'');
await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/tickets/details/1475109000000535091',{waitUntil:'domcontentloaded',timeout:90000});
for(let i=0;i<30;i++){await page.waitForTimeout(2000);if(/CONVERSATION/.test(await body()))break;}await page.waitForTimeout(4000);
const nn=page.locator('text=/^Not Now$/');if(await nn.count())await nn.first().click().catch(()=>{});
// main Reply All button (left part of split button)
const btn=page.locator('button,[role=button],div').filter({hasText:/^Reply All$/}).last();out.btn=await btn.count();
const bb=await page.getByText('Reply All',{exact:true}).first().boundingBox().catch(()=>null);out.bb=bb;
if(bb){await page.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2);await page.waitForTimeout(7000);await page.screenshot({path:D+'b-zoho-replyall.png'});
 const t=await body();const i=t.search(/\nTo\n|To:/);out.ra=t.slice(Math.max(0,i-60),i+250).replace(/\n+/g,' | ');}
// split arrow -> Reply
await page.keyboard.press('Escape');await page.waitForTimeout(1500);
const disc=page.getByText(/^(Discard|Discard Draft)$/).first();if(await disc.count()){out.discardShown=true;}
out.writes=writes;console.log(JSON.stringify(out,null,1));await b.close();})().catch(e=>{console.error('ERR',e.message);process.exit(1)});
