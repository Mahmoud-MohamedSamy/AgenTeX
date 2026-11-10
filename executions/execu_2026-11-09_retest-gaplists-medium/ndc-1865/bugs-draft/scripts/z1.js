const path=require('path');const P='D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const {chromium}=require(path.join(P,'node_modules/playwright-core'));
const D=P+'/executions/execu_2026-11-09_retest-gaplists-medium/ndc-1865/bugs-draft/raw/zoho/';
const Z='https://desk.zoho.com/agent/techsolutionsegypt/tech/';
(async()=>{const b=await chromium.launch({headless:false,channel:'msedge'});
const ctx=await b.newContext({storageState:process.env.ST,viewport:{width:1600,height:900}});const page=await ctx.newPage();const out={};
const body=()=>page.locator('body').innerText().catch(()=>'');
const wt=async(re,ms=60000)=>{const t0=Date.now();while(Date.now()-t0<ms){const t=await body();if(re.test(t))return t;await page.waitForTimeout(2000);}return null;};
const go=async(h,re,name)=>{for(let i=0;i<2;i++){await page.goto(Z+h,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});const t=await wt(re,60000);if(t){await page.waitForTimeout(4000);await page.screenshot({path:D+name+'.png'});return t;}}await page.screenshot({path:D+name+'-fail.png'});return null;};
const dismiss=async()=>{const n=page.locator('text=/^Not Now$/');if(await n.count())await n.first().click().catch(()=>{});};
// E: CRM integration tabs
let t=await go('setup#setup/marketplace/zoho/crm',/CONFIGURATION DETAILS|SYNC HISTORY/i,'e-crm-config');await dismiss();
for(const [tab,name] of [['SYNC HISTORY','e-sync-history'],['FAILURE LOG','e-failure-log']]){const l=page.getByText(new RegExp('^'+tab+'$','i')).first();if(await l.count()){await l.click();await page.waitForTimeout(8000);await page.screenshot({path:D+name+'.png'});out[name]=(await body()).split('\n').filter(Boolean).slice(30,70).join(' | ').slice(0,700);}}
// K1: Bulk Action Log
t=await go('setup#setup/data-administration/bulk-action-log',/Bulk Action/i,'k1-bulk-action-log');
if(t){out.k1=t.split('\n').filter(l=>/mass|update|delete|import|export|action/i.test(l)).slice(0,25);
 const dd=page.locator('text=/All Actions|Action Type|All Action/i').first();if(await dd.count()){await dd.click().catch(()=>{});await page.waitForTimeout(2500);await page.screenshot({path:D+'k1-bulk-action-types.png'});out.k1types=(await body()).split('\n').filter(l=>/mass|update|delete|import|export|merge|assign/i.test(l)).slice(0,25);await page.keyboard.press('Escape');}}
// K2: Audit Log
t=await go('setup#setup/data-administration/audit-log',/Audit Log/i,'k2-audit-log');
if(t){out.k2=t.split('\n').filter(l=>/export/i.test(l)).slice(0,10);}
console.log(JSON.stringify(out,null,1));await b.close();})().catch(e=>{console.error('ERR',e.message);process.exit(1)});
