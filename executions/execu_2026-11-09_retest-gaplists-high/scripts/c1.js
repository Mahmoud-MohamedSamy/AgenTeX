const fs=require('fs');const L='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-high/ndc-2392/';
const led=s=>fs.appendFileSync(L+'ledger.md','- '+new Date().toISOString()+' '+s+'\n');
const tok=async()=>(await ctx.cookies()).find(x=>x.name==='aw_staging_access_token').value;
const crm=async(m,p,b)=>{const r=await ctx.request.fetch('https://staging-crm.taviportal.com/api/v1'+p,{method:m,headers:{authorization:'Bearer '+await tok(),'x-app-key':'crm',...(b?{'content-type':'application/json'}:{})},data:b?JSON.stringify(b):undefined,failOnStatusCode:false,timeout:120000});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}return {s:r.status(),j,t:t.slice(0,600)};};
const IDS={lead:['841043e1-c078-41f9-8d6e-dfd61bee45c3','69d2ca6a-5702-4d6f-978f-a99f86f462de'],crmContact:['6f553963-01d6-4b68-9fb3-143d23044c41','faa1c662-6f09-49b8-90a4-a5b9bb6ccf68'],deskContact:['43004ce2-577f-4eda-b00a-0750fe40c3d4','dc8403e7-39b8-4057-979f-32483beb6ffb']};
const out={};
for(const k of ['crmContact','lead']){const [m,id]=IDS[k];const r=await crm('DELETE',`/modules/${m}/records/${id}`);out['del_'+k]=r.s;led(`DELETE ${k} ${id} → ${r.s}`);}
await sleep(15000);
{const [m,id]=IDS.deskContact;const r=await api('DELETE',`/modules/${m}/records/${id}`);out.del_desk=r.s;led(`DELETE deskContact ${id} → ${r.s}`);}
await sleep(8000);
const want=new Set(Object.values(IDS).map(x=>x[1]));
const purge=async(fn,tag)=>{const items=arr((await fn('GET','/audit/recycle-bin/items?limit=200')).j?.data);const hit=items.filter(i=>want.has(i.record_id||i.recordId||i.entity_id));out[tag+'_found']=hit.map(i=>(i.record_id||i.recordId||i.entity_id));
 if(hit.length){const r=await fn('POST','/audit/recycle-bin/delete',{ids:hit.map(i=>i.id)});out[tag+'_purge']=r.s;led(`purge ${tag} bin ids ${hit.map(i=>i.id).join(',')} → ${r.s}`);}};
await purge(api,'desk');await purge(crm,'crm');
// verify
out.verify={lead:(await crm('GET',`/modules/${IDS.lead[0]}/records/${IDS.lead[1]}`)).s,crmContact:(await crm('GET',`/modules/${IDS.crmContact[0]}/records/${IDS.crmContact[1]}`)).s,desk:(await api('GET',`/modules/${IDS.deskContact[0]}/records/${IDS.deskContact[1]}`)).s};
const again=async fn=>arr((await fn('GET','/audit/recycle-bin/items?limit=200')).j?.data).filter(i=>want.has(i.record_id||i.recordId||i.entity_id)).length;
out.binLeft={desk:await again(api),crm:await again(crm)};
led('verify '+JSON.stringify(out.verify)+' binLeft '+JSON.stringify(out.binLeft));
return out;
