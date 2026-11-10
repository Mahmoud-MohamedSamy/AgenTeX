const path=require('path');const P='D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const {chromium}=require(path.join(P,'node_modules/playwright-core'));
const D=P+'/executions/execu_2026-11-09_retest-gaplists-medium/ndc-1865/bugs-draft/raw/zoho/';
const Z='https://desk.zoho.com/agent/techsolutionsegypt/tech/';
(async()=>{const b=await chromium.launch({headless:false,channel:'msedge'});
const ctx=await b.newContext({storageState:process.env.ST,viewport:{width:1600,height:900}});const page=await ctx.newPage();const out={};
const body=()=>page.locator('body').innerText().catch(()=>'');
const wt=async(re,ms=60000)=>{const t0=Date.now();while(Date.now()-t0<ms){const t=await body();if(re.test(t))return t;await page.waitForTimeout(2000);}return null;};
const dismiss=async()=>{for(const s of ['text=/^Not Now$/','[aria-label="Close"]']){const n=page.locator(s);if(await n.count())await n.first().click().catch(()=>{});}};
await page.goto(Z+'setup#setup/marketplace/zoho/crm',{waitUntil:'domcontentloaded',timeout:90000});await wt(/SYNC HISTORY/i,90000);await page.waitForTimeout(5000);await dismiss();
for(const [tab,name] of [['Sync History','e-sync-history'],['Failure Log','e-failure-log']]){const l=page.locator('text=/^'+tab+'$/i').first();out[name+'-found']=await l.count();if(await l.count()){await l.click({force:true});await page.waitForTimeout(9000);await page.screenshot({path:D+name+'.png'});const t=await body();const i=t.search(/SYNC HISTORY/i);out[name]=t.slice(i,i+900).replace(/\n+/g,' | ').slice(0,700);}}
// sidebar Bulk Action Log
const bal=page.locator('text=/^Bulk Action Log$/').first();out.bal=await bal.count();if(await bal.count()){await bal.click({force:true});await page.waitForTimeout(3000);const t=await body();out.balMenu=t.split('\n').filter(l=>/log|mass|update|import|export|delete/i.test(l)).slice(0,20);await page.screenshot({path:D+'k1-bulk-menu.png'});
 const sub=page.locator('text=/^(Tickets|Contacts)$/').first();if(await sub.count()){await sub.click({force:true}).catch(()=>{});await page.waitForTimeout(8000);await page.screenshot({path:D+'k1-bulk-action-log.png'});out.balPage=(await body()).split('\n').filter(l=>/mass|update|delete|import|export|action|status/i.test(l)).slice(0,25);}}
// Setup search: audit
const s=page.locator('input[placeholder*="Search in Setup"]').first();if(await s.count()){await s.fill('Audit');await page.waitForTimeout(3000);out.auditSearch=(await body()).split('\n').filter(l=>/audit/i.test(l)).slice(0,10);const a=page.locator('text=/Audit Log/i').first();if(await a.count()){await a.click({force:true}).catch(()=>{});await page.waitForTimeout(10000);await page.screenshot({path:D+'k2-audit-log.png'});out.audit=(await body()).split('\n').filter(l=>/export|audit|action/i.test(l)).slice(0,20);}}
console.log(JSON.stringify(out,null,1));await b.close();})().catch(e=>{console.error('ERR',e.message);process.exit(1)});
