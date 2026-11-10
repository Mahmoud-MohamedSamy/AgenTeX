const fs=require('fs');const LG='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-2628/ledger.md';const LED=s=>fs.appendFileSync(LG,'- '+new Date().toISOString()+' '+s+'\n');
const L='841043e1-c078-41f9-8d6e-dfd61bee45c3';const D='../ndc-2628/evidence/raw/';const o={steps:[]};
const writes=[];page.on('response',async r=>{const q=r.request();const u=r.url();if(u.includes('/api/v1/')&&q.method()!=='GET'&&!/resolved-batch|realtime|heartbeat|iam\/auth|proofing/.test(u)){let t='';try{t=(await r.text()).slice(0,160)}catch(e){}writes.push(q.method()+' '+u.split('/api/v1')[1].slice(0,100)+' → '+r.status()+' '+t);}});
await page.setViewportSize({width:1440,height:950});
await page.goto(H+'/modules/'+L+'/import',{waitUntil:'load',timeout:120000});await page.getByText('Upload your file').waitFor({timeout:90000});
const fc=page.waitForEvent('filechooser');await page.getByRole('button',{name:'Browse',exact:true}).click();(await fc).setFiles('C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/2277d712-728d-4ff8-b0ef-64ec515b6a3e/scratchpad/qa-rt-2628.csv');await page.waitForTimeout(4000);
for(let s=2;s<=5;s++){const nx=page.getByRole('button',{name:/^next$/i});if(!(await nx.count())||await nx.isDisabled()){o.steps.push('next disabled at step '+s);break;}await nx.click();await page.waitForTimeout(4500);
 const t=(await page.locator('main, body').first().innerText());const head=t.split('\n').filter(Boolean).slice(0,3).join(' / ');
 o.steps.push({s,head:head.slice(0,150),approval:t.split('\n').filter(l=>/approv|manual|review|coming soon/i.test(l)).slice(0,8)});await page.screenshot({path:D+'import-step'+s+'.png'});}
o.writes=writes;writes.forEach(w=>LED('import wizard write: '+w.slice(0,180)));
// leave wizard without importing
await page.getByRole('button',{name:/^cancel$/i}).click().catch(()=>{});await page.waitForTimeout(2000);
return o;
