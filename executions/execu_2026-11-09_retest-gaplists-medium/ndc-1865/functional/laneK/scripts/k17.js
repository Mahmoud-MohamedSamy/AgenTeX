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
const IDS=['c12bc93e-3c1d-4e66-beb0-0a6aad058080','066f2af9-0ad0-4332-918f-f6d01d000091'];const CRMIDS=['50e614c4-bf2d-4013-86ce-cc50c6901eeb','cda72981-b2a9-4003-9616-4dc10775dd1b'];
const tok=(await ctx.cookies()).find(x=>x.name==='aw_staging_access_token');
const crm=async(m,p,b)=>{const r=await ctx.request.fetch('https://staging-crm.taviportal.com/api/v1'+p,{method:m,headers:{authorization:'Bearer '+(tok&&tok.value),'x-app-key':'crm','content-type':'application/json'},data:b?JSON.stringify(b):undefined,failOnStatusCode:false});return {s:r.status(),t:(await r.text())};};
// bulk actions log after mass update + undo
try{await page.goto(H+'/settings/data/bulk-actions',{waitUntil:'load',timeout:180000});await wt(/Initiated time/,120000);await page.waitForTimeout(5000);const t=await body();out.bl=t.slice(t.indexOf('Action\tModule')).split('\n').filter(l=>l.trim()).slice(0,7);await shot('k17-bulk-log-final');}catch(e){out.blErr=String(e).slice(0,120);}
// purge Desk bin
const bin=arr((await api('GET','/audit/recycle-bin/items')).j).filter(i=>IDS.includes(i.record_id));
if(bin.length){const p=await api('POST','/audit/recycle-bin/delete',{ids:bin.map(i=>i.id)});out.purgeDesk=p.s;log('PURGE Desk bin '+bin.map(i=>i.id).join(',')+' → '+p.s);}
// CRM side
const mods=await crm('GET','/modules');const j=JSON.parse(mods.t);const a=Array.isArray(j.data)?j.data:(j.data&&(j.data.items||j.data.modules))||[];const mid=(a.find(x=>/^contacts$/i.test(x.api_name||x.apiName||x.name||''))||{}).id;
out.crm={};for(const R of CRMIDS){const g=await crm('GET',`/modules/${mid}/records/${R}`);out.crm[R.slice(0,8)+' before']=g.s;
 if(g.s===200){const d=await crm('DELETE',`/modules/${mid}/records/${R}`);out.crm[R.slice(0,8)+' del']=d.s;log(`DELETE CRM contact ${R} (created by sync from import) → ${d.s}`);}}
await sleep(4000);
const cb=JSON.parse((await crm('GET','/audit/recycle-bin/items')).t);const items=(Array.isArray(cb.data)?cb.data:(cb.data&&cb.data.items)||[]).filter(i=>CRMIDS.includes(i.record_id));
if(items.length){const p=await crm('POST','/audit/recycle-bin/delete',{ids:items.map(i=>i.id)});out.purgeCrm=p.s;log('PURGE CRM bin '+items.map(i=>i.id).join(',')+' → '+p.s);}
await sleep(3000);
out.verify=[];for(const id of IDS)out.verify.push('desk '+id.slice(0,8)+' '+(await api('GET','/modules/43004ce2-577f-4eda-b00a-0750fe40c3d4/records/'+id)).s);
for(const R of CRMIDS)out.verify.push('crm '+R.slice(0,8)+' '+(await crm('GET',`/modules/${mid}/records/${R}`)).s);
out.deskBinLeft=arr((await api('GET','/audit/recycle-bin/items')).j).filter(i=>IDS.includes(i.record_id)||/1865 K/.test(JSON.stringify(i))).length;
const cb2=JSON.parse((await crm('GET','/audit/recycle-bin/items')).t);out.crmBinLeft=(Array.isArray(cb2.data)?cb2.data:(cb2.data&&cb2.data.items)||[]).filter(i=>CRMIDS.includes(i.record_id)||/1865 K/.test(JSON.stringify(i))).length;
const s=await api('GET','/modules/43004ce2-577f-4eda-b00a-0750fe40c3d4/records?pageSize=10&q=QA%20FT%201865%20K');out.searchLeft=arr(s.j).length;
log('VERIFY '+out.verify.join(', ')+'; desk bin left '+out.deskBinLeft+'; crm bin left '+out.crmBinLeft+'; search hits '+out.searchLeft);
return Object.assign(out,{calls:[...new Set(calls)]});
