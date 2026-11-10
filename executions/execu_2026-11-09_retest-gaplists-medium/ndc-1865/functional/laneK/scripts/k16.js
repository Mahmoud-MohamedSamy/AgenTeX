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
const IDS=['c12bc93e-3c1d-4e66-beb0-0a6aad058080','066f2af9-0ad0-4332-918f-f6d01d000091'];
let step='nav';try{
await page.goto(H+'/settings/data/import',{waitUntil:'load',timeout:180000});await wt(/Choose a module/,180000);await page.waitForTimeout(3000);
await page.getByRole('button',{name:/Import history/}).first().click();await page.waitForTimeout(6000);
const row=page.locator('tr,[role=row]').filter({hasText:'qa-ft-1865-k-contacts.csv'}).first();
step='manage';await row.getByRole('button',{name:'Manage'}).click();await page.waitForTimeout(6000);const r2=page.locator('tr,[role=row]').filter({hasText:'qa-ft-1865-k-contacts.csv'}).first();await r2.locator('button').last().click();await page.waitForTimeout(2500);
out.menu=(await page.locator('[role=menuitem],[role=dialog]').allInnerTexts()).map(s=>s.replace(/\n/g,' | ').slice(0,300)).slice(0,6);await shot('k16-manage');
step='undo';const u=page.getByRole('menuitem',{name:/Undo/}).or(page.getByRole('button',{name:/Undo/})).first();await u.click({timeout:15000});await page.waitForTimeout(3000);
const d=page.locator('[role=dialog],[role=alertdialog]').last();out.confirm=(await d.innerText().catch(()=>'')).replace(/\n/g,' | ').slice(0,300);await shot('k16-undo-confirm');
const b=d.getByRole('button').filter({hasText:/Undo|Confirm|Yes/i}).last();if(await b.count()){await b.click();await page.waitForTimeout(15000);}
out.after=(await body()).split('\n').filter(l=>/qa-ft-1865-k|undone|Undo|rolled|Recycle/i.test(l)).slice(0,6);await shot('k16-after-undo');
}catch(e){out.err=step+': '+String(e).slice(0,200);await shot('k16-err-'+step);}
out.records=[];for(const id of IDS)out.records.push(id.slice(0,8)+' '+(await api('GET','/modules/43004ce2-577f-4eda-b00a-0750fe40c3d4/records/'+id)).s);
const bin=arr((await api('GET','/audit/recycle-bin/items')).j).filter(i=>IDS.includes(i.record_id));out.bin=bin.map(i=>i.id+' '+i.record_id.slice(0,8));
if(/404/.test(out.records.join()))log('UNDO import 73c20717 via Import history → Manage → Undo: records '+out.records.join(', ')+'; bin items '+out.bin.join(', '));
return Object.assign(out,{calls:[...new Set(calls)]});
