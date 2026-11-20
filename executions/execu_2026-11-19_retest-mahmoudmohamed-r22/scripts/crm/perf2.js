const R={};const pct=(a,p)=>{const s=[...a].sort((x,y)=>x-y);return s[Math.min(s.length-1,Math.ceil(p/100*s.length)-1)];};const L='841043e1-c078-41f9-8d6e-dfd61bee45c3';
const pick=async(name)=>{await page.mouse.click(360,165);await sleep(1500);await page.getByPlaceholder('Search views').fill(name);await sleep(1500);R['opts_'+name]=(await page.locator('[role=option],li,button').allInnerTexts()).map(s=>s.trim()).filter(s=>/lead/i.test(s)).slice(0,8);await page.getByText(new RegExp('^'+name)).last().click({timeout:10000});await sleep(4000);};
await page.goto(H+'/modules/'+L+'/records',{waitUntil:'commit'});await page.getByText('QA RT20 SC hot leads').first().waitFor({timeout:90000});await sleep(2000);
await pick('All Leads');R.view=(await page.locator('main').innerText()).slice(0,140).replace(/\s+/g,' ');
const listReady=()=>{const r=document.querySelectorAll('table tbody tr');return r.length>0&&r[0].innerText.trim().length>3;};
const t=[];for(let i=0;i<20;i++){const t0=Date.now();await page.goto(H+'/modules/'+L+'/records',{waitUntil:'commit'});try{await page.waitForFunction(listReady,null,{timeout:40000,polling:50});t.push(Date.now()-t0);}catch(e){t.push(40000);}}
R.leadsList={p95:pct(t,95),median:pct(t,50),min:Math.min(...t),max:Math.max(...t),all:t.join(',')};await shot('crm-perf-a-leads.png',{timeout:60000});
await pick('QA RT20 SC hot leads');R.restored=(await page.locator('main').innerText()).slice(0,80).replace(/\s+/g,' ');
const p='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-19_retest-mahmoudmohamed-r22/out/perf.json';const f=JSON.parse(require('fs').readFileSync(p,'utf8'));f.leadsList=R.leadsList;require('fs').writeFileSync(p,JSON.stringify(f,null,1));
return R;
