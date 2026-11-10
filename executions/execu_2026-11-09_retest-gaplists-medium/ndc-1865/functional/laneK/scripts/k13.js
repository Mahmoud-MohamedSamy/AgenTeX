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
const r=await api('GET','/audit/events?limit=50');out.s=r.s;const ev=arr(r.j);out.n=ev.length;out.sampleKeys=ev[0]?Object.keys(ev[0]):[];
const since=Date.parse('2026-11-10T13:15:00Z');
out.mine=ev.filter(e=>Date.parse(e.created_at||e.occurred_at||e.timestamp||0)>=since).map(e=>[(e.created_at||e.occurred_at||'').slice(11,19),e.action||e.event_type||e.type,e.entity_type||e.resource_type||e.module,(e.summary||e.description||e.entity_label||'').toString().slice(0,90),e.actor_label||e.actor_name||e.user_name||''].join(' | ')).slice(0,40);
let step='ui';try{await page.goto(H+'/settings/security/audit-log',{waitUntil:'load',timeout:180000});await wt(/Audit/,120000);await page.waitForTimeout(10000);
const t=await body();out.ui=t.split('\n').filter(l=>/mahmoud\.mahamed1515|Import|Export|Mass|QA FT 1865 K/i.test(l)).slice(0,25);await page.screenshot({path:D+'k13-audit-log.png'});}catch(e){out.err=step+': '+String(e).slice(0,200);}
return out;
