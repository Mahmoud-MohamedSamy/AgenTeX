// read-only: Approval Processes list; Assignment create dialog with module list open (closed without saving)
const P='D:/Software Testing/Automation/Agentex Installation/Agentex Installation';const R=P+'/executions/execu_2026-11-22_jam-fb154ab6';const {chromium}=require(P+'/node_modules/playwright-core');
(async()=>{const b=await chromium.launch({headless:true,channel:'msedge'});const ctx=await b.newContext({viewport:{width:1500,height:900},storageState:R+'/zoho-state.json'});const p=await ctx.newPage();const res={};
const vis=async(t)=>{const L=p.getByText(t,{exact:true});const n=await L.count();for(let i=n-1;i>=0;i--){const e=L.nth(i);if(await e.isVisible()){await e.scrollIntoViewIfNeeded();await e.click();return true;}}return false;};
await p.goto('https://crm.zoho.com/crm/org946877290/settings/workflow-rules',{waitUntil:'domcontentloaded',timeout:90000});for(let i=0;i<60;i++){await p.waitForTimeout(2000);const t=await p.innerText('body').catch(()=>'');if(/Approval Processes/.test(t)&&!/^s*Loading/.test(t))break;}await p.waitForTimeout(3000);
res.apClick=await vis('Approval Processes');await p.waitForTimeout(10000);await p.screenshot({path:R+'/evidence/raw/zoho-ap.png'});res.apUrl=p.url().replace(/[?].*$/,'');res.apText=(await p.innerText('body')).replace(/\s+/g,' ').slice(-600);
for(let i=0;i<30;i++){await p.waitForTimeout(2000);const t=await p.innerText("body").catch(()=>"");if(/Assignment/.test(t)&&!/^s*Loading/.test(t))break;}
res.arClick=await vis('Assignment');await p.waitForTimeout(9000);res.btn=await vis('Create Assignment Rule');await p.waitForTimeout(4000);
await p.getByText('Select Module',{exact:true}).first().click().catch(e=>res.selErr=e.message.split('\n')[0]);await p.waitForTimeout(3000);
await p.screenshot({path:R+'/evidence/raw/zoho-ar-new.png'});res.arText=(await p.innerText('body')).replace(/\s+/g,' ').slice(-500);
await b.close();console.log(JSON.stringify(res,null,1));})().catch(e=>{console.error('ERR',e.message.split('\n')[0]);process.exit(1)});
