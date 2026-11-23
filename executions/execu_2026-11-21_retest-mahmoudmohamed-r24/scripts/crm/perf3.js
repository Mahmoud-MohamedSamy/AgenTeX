const R={};const pct=(a,p)=>{const s=[...a].sort((x,y)=>x-y);return s[Math.min(s.length-1,Math.ceil(p/100*s.length)-1)];};const L='841043e1-c078-41f9-8d6e-dfd61bee45c3';
const listReady=()=>{const r=document.querySelectorAll('table tbody tr');return r.length>0&&r[0].innerText.trim().length>3;};
await page.goto(H+'/modules/'+L+'/records',{waitUntil:'commit'});await sleep(12000);R.view=(await page.locator('main').innerText()).slice(0,140).replace(/\s+/g,' ');
const t=[];for(let i=0;i<20;i++){const t0=Date.now();await page.goto(H+'/modules/'+L+'/records',{waitUntil:'commit'});try{await page.waitForFunction(listReady,null,{timeout:40000,polling:50});t.push(Date.now()-t0);}catch(e){t.push(40000);}}
R.leadsList={p95:pct(t,95),median:pct(t,50),min:Math.min(...t),max:Math.max(...t),all:t.join(',')};
const p='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-19_retest-mahmoudmohamed-r22/out/perf.json';const f=JSON.parse(require('fs').readFileSync(p,'utf8'));f.leadsList=R.leadsList;f.leadsView=R.view;require('fs').writeFileSync(p,JSON.stringify(f,null,1));
await shot('crm-perf-a-leads.png',{timeout:60000});return R;
