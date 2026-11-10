const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-1865/functional/laneK/evidence/raw/';
const T='5254adb3-80f2-4c12-9c6e-e7e7a1c7150a';const out={};const calls=[];
const fs=require('fs');const L='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-1865/functional/laneK/ledger.md';const log=s=>fs.appendFileSync(L,`- ${new Date().toISOString()} ${s}\n`);
page.on('response',r=>{const u=r.url();const m=r.request().method();if(/api\/v1/.test(u)&&!/iam\/auth/.test(u)&&(m!=='GET'||r.status()>=400)&&!/heartbeat|resolved-batch|realtime|summaries/.test(u))calls.push(r.status()+' '+m+' '+u.replace(/.*api\/v1/,'').replace(/\?.*/,'').slice(0,100));});
const wt=async(re,ms=90000)=>{const t0=Date.now();while(Date.now()-t0<ms){const t=await page.locator('body').innerText().catch(()=>'');if(re.test(t))return t;await page.waitForTimeout(1500);}return null;};
const body=()=>page.locator('body').innerText();
const lines=async(re,n=15)=>(await body()).split('\n').filter(l=>re.test(l)).slice(0,n);
const shot=n=>page.screenshot({path:D+n+'.png'});
await page.setViewportSize({width:1440,height:900});
const openTicket=async()=>{for(let i=0;i<3;i++){await page.goto(H+"/views/all/tickets/"+T,{waitUntil:"load",timeout:120000});const t=await wt(/QA FT 1865 H reply check[\s\S]*CONVERSATION|Something went wrong/i);if(t&&!/Something went wrong/.test(t))return true;await page.waitForTimeout(5000);}return false;};

const CSV='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-1865/functional/laneK/evidence/qa-ft-1865-k-contacts.csv';
const all=[];page.on('response',r=>{const u=r.url();if(/api\/v1/.test(u)&&!/iam\/auth/.test(u)&&/import/i.test(u))all.push(r.status()+' '+r.request().method()+' '+u.replace(/.*api\/v1/,'').slice(0,120));});
const tail=async(n=25)=>(await body()).split('\n').filter(l=>l.trim()).slice(-n);
let step='nav';out.steps={};try{
await page.goto(H+'/settings/data/import',{waitUntil:'load',timeout:180000});await wt(/Choose a module/,180000);await page.waitForTimeout(3000);
out.landing=(await body()).split('\n').filter(l=>/import|progress|history/i.test(l)).slice(0,15);await shot('k2-0-landing');
step='module';await page.getByText('Choose a module').nth(1).click();await page.waitForTimeout(1000);await page.locator('[role=option]').filter({hasText:/^Contacts$/}).first().click();await page.waitForTimeout(800);
step='start';await page.getByRole('button',{name:'Start import'}).click();await page.waitForTimeout(6000);
out.bannerAtStart=/import in progress/i.test(await body());if(out.bannerAtStart){await shot('k2-banner-at-start');await page.getByRole('button',{name:'Start over'}).click();await page.waitForTimeout(5000);}
await wt(/Upload your file/);await page.waitForTimeout(1000);
step='upload';await page.locator('input[type=file]').last().setInputFiles(CSV);await page.waitForTimeout(5000);
const em=page.getByLabel('Email me when the import finishes');if(await em.count()&&await em.isChecked())await em.uncheck();
for(const s of ['operation','map']){step=s;await page.getByRole('button',{name:/^Next$/}).last().click({timeout:20000});await page.waitForTimeout(6000);out.steps[s]=await tail(12);}
step='assign';await wt(/Assign & approve|Assign/);out.steps.assign=await tail(20);await shot('k2-assign');
await page.getByRole('button',{name:/Save & next|^Next$/}).last().click({timeout:20000});await page.waitForTimeout(8000);
step='review';out.steps.review=await tail(25);await shot('k2-review');
const btns=await page.getByRole('button').allInnerTexts();out.buttons=btns.map(s=>s.trim()).filter(Boolean).slice(-12);
}catch(e){out.err=step+': '+String(e).slice(0,200);await shot('k2-err-'+step);out.errTail=await tail(20).catch(()=>null);}
return Object.assign(out,{calls:[...new Set(calls)],importCalls:[...new Set(all)]});
