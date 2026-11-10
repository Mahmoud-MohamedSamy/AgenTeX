const fs=require('fs');const L='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-1865/functional/laneH/ledger.md';const log=s=>fs.appendFileSync(L,`- ${new Date().toISOString()} ${s}\n`);
const out={};const tok=(await ctx.cookies()).find(x=>x.name==='aw_staging_access_token');const R='8f791451-29bf-486a-b2a6-9cbd8b0e4967';
const crm=async(m,p,b)=>{const r=await ctx.request.fetch('https://staging-crm.taviportal.com/api/v1'+p,{method:m,headers:{authorization:'Bearer '+(tok&&tok.value),'x-app-key':'crm','content-type':'application/json'},data:b?JSON.stringify(b):undefined,failOnStatusCode:false});return {s:r.status(),t:(await r.text())};};
const mods=await crm('GET','/modules');out.mods=mods.s;let mid=null;try{const j=JSON.parse(mods.t);const a=Array.isArray(j.data)?j.data:(j.data&&(j.data.items||j.data.modules))||[];const c=a.find(x=>/^contacts$/i.test(x.api_name||x.apiName||x.name||''));mid=c&&c.id;out.contactsModule=mid;}catch(e){out.parseErr=mods.t.slice(0,200);}
if(mid){const g=await crm('GET',`/modules/${mid}/records/${R}`);out.get=g.s+' '+g.t.slice(0,200);
 if(g.s===200){const d=await crm('DELETE',`/modules/${mid}/records/${R}`);out.del=d.s;log(`DELETE CRM contact ${R} (created by sync) → ${d.s}`);
  await new Promise(r=>setTimeout(r,3000));const b=await crm('GET','/audit/recycle-bin/items');let items=[];try{const j=JSON.parse(b.t);items=Array.isArray(j.data)?j.data:(j.data&&j.data.items)||[];}catch(e){}const it=items.filter(i=>i.record_id===R);out.binItems=it.length;
  if(it.length){const p=await crm('POST','/audit/recycle-bin/delete',{ids:it.map(i=>i.id)});out.purge=p.s;log(`PURGE CRM bin ${it.map(i=>i.id).join(',')} → ${p.s}`);}
  out.verify=(await crm('GET',`/modules/${mid}/records/${R}`)).s;log(`VERIFY CRM contact ${R} → ${out.verify}`);}}
return out;
