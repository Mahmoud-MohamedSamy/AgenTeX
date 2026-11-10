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
out.links={};for(const id of IDS){const l=await api('GET','/desk/integrations/crm/links?record_id='+id);out.links[id]=l.s+' '+l.t.slice(0,300);}
let step='bl';try{
await page.goto(H+'/settings/data/bulk-actions',{waitUntil:'load',timeout:180000});await wt(/Bulk/,120000);await page.waitForTimeout(8000);
const t=await body();out.bl=t.slice(t.lastIndexOf('Bulk')).split('\n').filter(l=>l.trim()).slice(0,25);await shot('k7-bulk-log-before');
step='list';await page.goto(H+'/modules/43004ce2-577f-4eda-b00a-0750fe40c3d4',{waitUntil:'load',timeout:180000});await wt(/QA QA FT 1865 K Import 2/,120000);await page.waitForTimeout(3000);
const cbs=page.locator('input[type=checkbox]');out.cbCount=await cbs.count();
for(const n of ['QA QA FT 1865 K Import 1','QA QA FT 1865 K Import 2']){const row=page.locator('tr,[role=row],li,div').filter({hasText:n}).filter({has:page.locator('input[type=checkbox]')}).last();out['row '+n]=await row.count();if(await row.count())await row.locator('input[type=checkbox]').first().check({force:true});}
await page.waitForTimeout(2000);out.bulkBar=(await body()).split('\n').filter(l=>/selected|Assign|Update|Delete|More|Merge|Tag|Export|Send/i.test(l)).slice(0,20);await shot('k7-selected');
}catch(e){out.err=step+': '+String(e).slice(0,200);await shot('k7-err-'+step);}
return Object.assign(out,{calls:[...new Set(calls)]});
