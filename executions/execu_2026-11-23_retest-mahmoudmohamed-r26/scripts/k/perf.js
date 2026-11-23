const R={};const pct=(a,p)=>{const s=[...a].sort((x,y)=>x-y);return s[Math.min(s.length-1,Math.ceil(p/100*s.length)-1)];};
const L='841043e1-c078-41f9-8d6e-dfd61bee45c3',D='f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
const stat=t=>({p95:pct(t,95),median:pct(t,50),min:Math.min(...t),max:Math.max(...t),all:t.join(',')});
const SAVE=()=>require('fs').writeFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-23_retest-mahmoudmohamed-r26/out/perf.json',JSON.stringify(R,null,1));const run=async(url,ready,n)=>{const t=[];for(let i=0;i<n;i++){const t0=Date.now();await page.goto(url,{waitUntil:'commit'});try{await page.waitForFunction(ready,null,{timeout:40000,polling:50});t.push(Date.now()-t0);}catch(e){t.push(40000);}}return stat(t);};
const kanbanReady=()=>{const h=[...document.querySelectorAll('main *')].filter(e=>e.childElementCount===0&&/^Amount$/.test(e.textContent.trim()));const cards=document.body.innerText.match(/Create Transactions/g)||[];return h.length>=3&&cards.length>=3&&/Probability/.test(document.body.innerText);};
const listReady=()=>{const r=document.querySelectorAll('table tbody tr');return r.length>0&&r[0].innerText.trim().length>3;};
// 2137: Deals kanban (current view: All Transactions, Kanban View)
R.kanban=await run(H+'/modules/'+D+'/records',kanbanReady,20);await shot('crm-perf-kanban.png',{timeout:90000});SAVE();
// 2136: Deals list mode
await page.mouse.click(1430,165);await sleep(4000);R.dealsMode=(await page.locator('main').innerText()).slice(0,80).replace(/\s+/g,' ');
R.dealsList=await run(H+'/modules/'+D+'/records',listReady,20);await shot('crm-perf-deals.png',{timeout:90000});SAVE();
// restore Deals to kanban
await page.mouse.click(1462,165);await sleep(3000);
R.leadsList=await run(H+'/modules/'+L+'/records',listReady,20);await shot('crm-perf-a-leads.png',{timeout:90000});SAVE();return R;
