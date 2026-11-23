const R={start:new Date().toISOString()};const pct=(a,p)=>{const s=[...a].sort((x,y)=>x-y);return s[Math.min(s.length-1,Math.ceil(p/100*s.length)-1)];};
const L='841043e1-c078-41f9-8d6e-dfd61bee45c3',D='f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';const F='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-23_retest-mahmoudmohamed-r26/out/perf2.json';
const SAVE=()=>require('fs').writeFileSync(F,JSON.stringify(R,null,1));const stat=t=>({p95:pct(t,95),median:pct(t,50),min:Math.min(...t),max:Math.max(...t),n:t.length,all:t.join(',')});
const listReady=()=>{const r=document.querySelectorAll('table tbody tr');return r.length>0&&r[0].innerText.trim().length>3;};
const kanbanReady=()=>{const h=[...document.querySelectorAll('main *')].filter(e=>e.childElementCount===0&&/^Amount$/.test(e.textContent.trim()));const cards=document.body.innerText.match(/Create Transactions/g)||[];return h.length>=3&&cards.length>=3&&/Probability/.test(document.body.innerText);};
const run=async(url,ready,n,tag)=>{const t=[];for(let i=0;i<n;i++){const t0=Date.now();await page.goto(url,{waitUntil:'commit'});try{await page.waitForFunction(ready,null,{timeout:40000,polling:50});t.push(Date.now()-t0);}catch(e){t.push(40000);const tx=(await page.locator('body').innerText().catch(()=>'')).slice(0,200).replace(/\s+/g,' ');R[tag+'_timeoutText']=tx;if(/No modules|Sign in|Log in/i.test(tx)){R[tag+'_sessionLost']=i;break;}}}return stat(t);};
const ping=async()=>page.evaluate(async()=>{const t0=performance.now();await fetch('/api/v1/iam/me').catch(()=>{});return Math.round(performance.now()-t0);});
// warm + check views
await page.goto(H+'/modules/'+L+'/records',{waitUntil:'commit'});await page.waitForFunction(listReady,null,{timeout:120000,polling:200}).catch(()=>{});R.leadsView=(await page.locator('main').first().innerText()).slice(0,120).replace(/\s+/g,' ');R.ping0=await ping();
R.leadsList=await run(H+'/modules/'+L+'/records',listReady,20,'leads');await shot('crm-p2-leads.png');SAVE();
await page.goto(H+'/modules/'+D+'/records',{waitUntil:'commit'});await sleep(15000);R.dealsStart=(await page.locator('main').first().innerText()).slice(0,140).replace(/\s+/g,' ');
R.kanban=await run(H+'/modules/'+D+'/records',kanbanReady,20,'kanban');await shot('crm-p2-kanban.png');SAVE();
await page.mouse.click(1430,165);await sleep(5000);R.dealsMode=(await page.locator('main').first().innerText()).slice(0,100).replace(/\s+/g,' ');
R.dealsList=await run(H+'/modules/'+D+'/records',listReady,20,'deals');await shot('crm-p2-deals.png');SAVE();
await page.mouse.click(1462,165);await sleep(4000);await shot('crm-p2-restored.png');R.ping1=await ping();R.end=new Date().toISOString();SAVE();return R;
