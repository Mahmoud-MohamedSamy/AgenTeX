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
const since=Date.parse('2026-11-10T13:15:00Z');let cur=null,all=[];
for(let i=0;i<30;i++){const r=await api('GET','/audit/events?limit=100'+(cur?'&cursor='+encodeURIComponent(cur):''));const ev=arr(r.j);all=all.concat(ev);cur=r.j&&r.j.meta&&r.j.meta.next_cursor;const last=ev[ev.length-1];if(!cur||!last||Date.parse(last.occurred_at)<since)break;}
out.scanned=all.length;
out.mine=all.filter(e=>Date.parse(e.occurred_at)>=since&&(/mahamed1515/.test(e.actor_label||'')||/QA FT 1865 K|qa-ft-1865-k/i.test(JSON.stringify(e)))).map(e=>[e.occurred_at.slice(11,19),e.action,e.target_type,(e.target_label||'').slice(0,70),e.actor_label].join(' | '));
return out;
