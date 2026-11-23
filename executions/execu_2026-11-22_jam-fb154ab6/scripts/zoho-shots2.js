// read-only Zoho capture via menu clicks; create dialogs are opened and cancelled, never saved
const fs=require('fs');const P='D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const R=P+'/executions/execu_2026-11-22_jam-fb154ab6';const {chromium}=require(P+'/node_modules/playwright-core');
const O='https://crm.zoho.com/crm/org946877290/settings/workflow-rules';
(async()=>{const b=await chromium.launch({headless:true,channel:'msedge'});const ctx=await b.newContext({viewport:{width:1500,height:900},storageState:R+'/zoho-state.json'});const p=await ctx.newPage();const res={};
const shot=n=>p.screenshot({path:R+'/evidence/raw/zoho-'+n+'.png'});
const menu=async(label)=>{await p.goto(O,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});await p.waitForTimeout(10000);const dn=p.locator('text="Don\'t show again"');if(await dn.count())await dn.first().click().catch(()=>{});{const L=p.getByText(label,{exact:true});const n=await L.count();let ok=false;for(let i=0;i<n;i++){if(await L.nth(i).isVisible()){await L.nth(i).click();ok=true;break;}}if(!ok)throw new Error('menu not visible: '+label+' n='+n);}await p.waitForTimeout(9000);};
for(const [k,label] of [['ap','Approval Processes'],['act','Actions']]){try{await menu(label);await shot(k);res[k]={url:p.url().replace(/[?].*$/,''),text:(await p.innerText('body')).replace(/\s+/g,' ').slice(0,500)};}catch(e){res[k]={ERR:e.message.split('\n')[0]}}}
// create dialogs (cancel, no save)
for(const [k,label,btn] of [['ar-new','Assignment','Create Assignment Rule'],['rp-new','Review Processes','Create New Process']]){try{await menu(label);{const L=p.getByText(btn,{exact:true});const n=await L.count();let ok=false;for(let i=0;i<n;i++){if(await L.nth(i).isVisible()){await L.nth(i).click();ok=true;break;}}if(!ok)throw new Error('btn not visible n='+n);}await p.waitForTimeout(6000);await shot(k);res[k]={url:p.url().replace(/[?].*$/,''),text:(await p.innerText('body')).replace(/\s+/g,' ').slice(-700)};}catch(e){res[k]={ERR:e.message.split('\n')[0]}}}
await b.close();console.log(JSON.stringify(res,null,1));})().catch(e=>{console.error('ERR',e.message.split('\n')[0]);process.exit(1)});
