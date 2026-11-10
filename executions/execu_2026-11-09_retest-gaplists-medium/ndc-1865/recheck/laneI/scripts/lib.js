const B='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-1865/recheck/laneI/';
const D=B+'evidence/raw/';const out={};const calls=[];
const fs=require('fs');const log=s=>fs.appendFileSync(B+'ledger.md',`- ${new Date().toISOString()} ${s}\n`);
const S=v=>({kind:'string',value:v});
const TK='88e8ea44-1658-4df3-9930-d0902b91073d',CT='43004ce2-577f-4eda-b00a-0750fe40c3d4',TECH='19510fdc-91f3-4a7a-8888-153f1318b765',C='de7195a2-369e-48c5-b03f-b8e37d6c5fb2';
page.on('response',r=>{const u=r.url();const m=r.request().method();if(/api\/v1/.test(u)&&!/iam\/auth/.test(u)&&(m!=='GET'||r.status()>=400)&&!/heartbeat|resolved-batch|realtime|summaries/.test(u))calls.push(r.status()+' '+m+' '+u.replace(/.*api\/v1/,'').replace(/\?.*/,'').slice(0,100));});
const wt=async(re,ms=90000)=>{const t0=Date.now();while(Date.now()-t0<ms){const t=await page.locator('body').innerText().catch(()=>'');if(re.test(t))return t;await page.waitForTimeout(1500);}return null;};
const body=()=>page.locator('body').innerText();
const lines=async(re,n=15)=>(await body()).split('\n').filter(l=>re.test(l)).slice(0,n);
const shot=n=>page.screenshot({path:D+n+'.png'});
await page.setViewportSize({width:1440,height:900});
const openTicket=async(id,subj)=>{for(let i=0;i<3;i++){await page.goto(H+"/views/all/tickets/"+id,{waitUntil:"commit",timeout:120000});const t=await wt(new RegExp(subj+'[\s\S]*CONVERSATION|Something went wrong','i'));if(t&&!/Something went wrong/.test(t))return true;await page.waitForTimeout(5000);}return false;};
const idOf=r=>r.j&&r.j.data&&(r.j.data.id||r.j.data.recordId);
// composer header text (From / Recipients / Cc / Subject) as lines
const composerInfo=async()=>{const t=await body();const i=t.indexOf('From');const seg=i>=0?t.slice(i,i+600):t.slice(0,600);return seg.split('\n').slice(0,14);};
