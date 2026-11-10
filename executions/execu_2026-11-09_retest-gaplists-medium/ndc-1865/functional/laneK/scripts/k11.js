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
let step='nav';try{
await page.goto(H+'/settings/data/export',{waitUntil:'load',timeout:180000});await wt(/Choose a module/,120000);await page.waitForTimeout(4000);
step='module';await page.getByText('Choose a module').last().click();await page.waitForTimeout(1200);out.mods=(await page.locator('[role=option]').allInnerTexts()).slice(0,20);
await page.locator('[role=option]').filter({hasText:/^Contacts$/}).first().click();await page.waitForTimeout(2500);
const t=await body();out.form=t.slice(t.indexOf('Contacts')).split('\n').filter(l=>l.trim()).slice(0,40);await page.screenshot({path:D+'k11-export-form.png',fullPage:true});
step='export';await page.getByRole('button',{name:/^Export$/}).first().click();await page.waitForTimeout(4000);
const dlg=page.locator('[role=dialog],[role=alertdialog]').last();if(await dlg.count()){out.dlg=(await dlg.innerText()).split('\n').filter(l=>l.trim()).slice(0,12);}
await page.waitForTimeout(25000);
const t2=await body();out.list=t2.split('\n').filter(l=>/csv|Completed|Queued|Processing|Failed|Download|Contacts/i.test(l)).slice(-12);await page.screenshot({path:D+'k11-export-list.png',fullPage:true});
}catch(e){out.err=step+': '+String(e).slice(0,200);await shot('k11-err-'+step);}
const ex=await api('GET','/desk/data/exports');out.exports=arr(ex.j).slice(0,3).map(x=>JSON.stringify(x).slice(0,500));
for(const x of arr(ex.j).slice(0,1))log('CREATED export job '+x.id+' (Contacts, CSV, all records, status '+x.status+')');
return Object.assign(out,{calls:[...new Set(calls)]});
