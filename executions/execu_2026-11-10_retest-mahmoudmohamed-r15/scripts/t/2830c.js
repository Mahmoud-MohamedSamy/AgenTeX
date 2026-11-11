const fs=require('fs');
const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-10_retest-mahmoudmohamed-r15';
const I=JSON.parse(fs.readFileSync(RUN+'/out/2830-ids.json','utf8'));
const errs=[]; page.on('response',r=>{const u=r.url(); if(/api\/v1/.test(u)&&r.status()>=400) errs.push(r.status()+' '+u.replace(/.*api\/v1/,'').slice(0,80));});
await page.goto(H+'/activities',{waitUntil:'domcontentloaded'}); for(let i=0;i<30;i++){await sleep(2000); if(/All Activities \(\d+\)|Activities/.test(await text())) break;} await sleep(5000);
const t=await text(); log('count', (t.match(/All Activities \(\d+\)/)||[''])[0]);
const si=page.locator('input[placeholder*="earch" i]').first(); if(!(await si.isVisible().catch(()=>false))){ await page.locator('button:near(:text("All Activities"))').nth(1).click().catch(()=>{}); await sleep(800);}
await page.locator('input[placeholder*="earch" i]').first().fill('QA RT15 2830'); await page.keyboard.press('Enter'); await sleep(6000);
const t2=await text(); log('search lines', t2.split('\n').filter(l=>/QA RT15 2830|Activities \(|No /.test(l)).slice(0,8));
await shot('2830-agent-activities-search.png');
await page.goto(H+'/modules/d120a6c2-2596-4254-968b-a1bcd3a000bf/records/'+I.task.id,{waitUntil:'domcontentloaded'}); await sleep(10000);
const t3=await text(); log('task page', t3.slice(t3.length-700).replace(/\n+/g,' | '));
await shot('2830-agent-open-task.png');
log('errors', errs.slice(0,10));
