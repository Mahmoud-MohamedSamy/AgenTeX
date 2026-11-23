const R={start:new Date().toISOString()};const pct=(a,p)=>{const s=[...a].sort((x,y)=>x-y);return s[Math.min(s.length-1,Math.ceil(p/100*s.length)-1)];};
const L='841043e1-c078-41f9-8d6e-dfd61bee45c3';const F='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-23_retest-mahmoudmohamed-r26/out/perf3.json';
const listReady=()=>{const r=document.querySelectorAll('table tbody tr');return r.length>0&&r[0].innerText.trim().length>3;};
await page.goto(H+'/modules/'+L+'/records',{waitUntil:'commit'});for(let i=0;i<40;i++){await sleep(2000);if(/records/.test(await page.locator('main').first().innerText().catch(()=>'')))break;}await sleep(3000);
R.before=(await page.locator('main').first().innerText()).slice(0,160).replace(/\s+/g,' ');
await page.mouse.click(1430,165);await sleep(6000);R.listMode=await page.locator('table tbody tr').count();await shot('crm-p3-leads-list.png');
const t=[];for(let i=0;i<20;i++){const t0=Date.now();await page.goto(H+'/modules/'+L+'/records',{waitUntil:'commit'});try{await page.waitForFunction(listReady,null,{timeout:40000,polling:50});t.push(Date.now()-t0);}catch(e){t.push(40000);R.tt=(await page.locator('body').innerText().catch(()=>'')).slice(0,150).replace(/\s+/g,' ');}}
R.leadsList={p95:pct(t,95),median:pct(t,50),min:Math.min(...t),max:Math.max(...t),n:t.length,all:t.join(',')};
await page.mouse.click(1462,165);await sleep(5000);await shot('crm-p3-leads-restored.png');R.after=(await page.locator('main').first().innerText()).slice(0,160).replace(/\s+/g,' ');
R.end=new Date().toISOString();require('fs').writeFileSync(F,JSON.stringify(R,null,1));return R;
