const R={};const pct=(a,p)=>{const s=[...a].sort((x,y)=>x-y);return s[Math.min(s.length-1,Math.ceil(p/100*s.length)-1)];};const L='841043e1-c078-41f9-8d6e-dfd61bee45c3';
const listReady=()=>{const r=document.querySelectorAll('table tbody tr');return r.length>0&&r[0].innerText.trim().length>3;};
await page.goto(H+'/modules/'+L+'/records',{waitUntil:'commit'});await page.waitForFunction(listReady,null,{timeout:90000,polling:200}).catch(()=>{});await sleep(2000);R.view=(await page.locator('main').first().innerText()).slice(0,160).replace(/\s+/g,' ');await shot('crm-leads-check.png');
const t=[];for(let i=0;i<20;i++){const t0=Date.now();await page.goto(H+'/modules/'+L+'/records',{waitUntil:'commit'});try{await page.waitForFunction(listReady,null,{timeout:40000,polling:50});t.push(Date.now()-t0);}catch(e){t.push(40000);}}
R.leadsList={p95:pct(t,95),median:pct(t,50),min:Math.min(...t),max:Math.max(...t),all:t.join(',')};await shot('crm-perf-leads2.png');
require('fs').writeFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-23_retest-mahmoudmohamed-r26/out/perf-leads.json',JSON.stringify(R,null,1));return R;
