// TK lane UI helpers (prepended to ui.js scripts). api() uses the shared owner token read-only (no refresh).
const fs=require('fs');const S='C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/64533306-cf5e-4d09-aa5c-24702973a047/scratchpad';
const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20';
const tok=()=>(JSON.parse(fs.readFileSync(S+'/r18-o.json','utf8')).cookies.find(c=>c.name==='aw_staging_access_token')||{}).value;
const api=async(m,p,b)=>{const r=await fetch(H+'/api/v1'+p,{method:m,headers:{'content-type':'application/json','x-app-key':'desk','x-tenant-id':'a7a7a7a7-0000-0000-0000-000000000004',authorization:'Bearer '+tok()},body:b!==undefined?JSON.stringify(b):undefined});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}return {s:r.status,j,t:t.slice(0,3000)};};
const arr=x=>Array.isArray(x)?x:(x&&(x.items||x.data||x.results||x.records))||[];
const TK='88e8ea44-1658-4df3-9930-d0902b91073d';
const LED=m=>fs.appendFileSync(RUN+'/ledger.md','- '+new Date().toISOString().slice(0,19)+'Z TK lane: '+m+'\n');
const NET=[];const BAD=/iam\/|auth|token/i;
page.on('response',async r=>{try{const q=r.request();const u=r.url();if(!u.includes('/api/v1/')||BAD.test(u))return;const m=q.method();if(m==='GET'&&!/delete|bulk/.test(u))return;let t='';try{t=(await r.text()).slice(0,400)}catch(e){}NET.push({m,u:u.replace(H+'/api/v1','').slice(0,300),len:u.length,s:r.status(),b:(q.postData()||'').slice(0,300),t});}catch(e){}});
page.on('requestfailed',q=>{const u=q.url();if(u.includes('/api/v1/')&&!BAD.test(u))NET.push({m:q.method(),u:u.replace(H+'/api/v1','').slice(0,200),len:u.length,FAILED:q.failure()?.errorText});});
const main=()=>page.locator('main').last();
const mtxt=async()=>(await main().innerText().catch(()=>'')).replace(/\s+/g,' ');
const toasts=async()=>(await page.locator('[data-sonner-toast],[role=status],[role=alert]').allInnerTexts().catch(()=>[])).join(' / ').replace(/\s+/g,' ').slice(0,400);
const dlg=async()=>(await page.locator('[role=dialog],[role=alertdialog]').last().innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,900);
