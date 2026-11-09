// NDC-2392 item 6: does a Desk contact whose email belongs to a CRM Lead create a new CRM contact?
const fs=require('fs');const L='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-high/ndc-2392/';
const led=s=>fs.appendFileSync(L+'ledger.md','- '+new Date().toISOString()+' '+s+'\n');
const tok=async()=>(await ctx.cookies()).find(x=>x.name==='aw_staging_access_token').value;
const crm=async(m,p,b)=>{const r=await ctx.request.fetch('https://staging-crm.taviportal.com/api/v1'+p,{method:m,headers:{authorization:'Bearer '+await tok(),'x-app-key':'crm',...(b?{'content-type':'application/json'}:{})},data:b?JSON.stringify(b):undefined,failOnStatusCode:false,timeout:120000});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}return {s:r.status(),j,t:t.slice(0,1200)};};
const out={};
const mods=arr((await crm('GET','/modules')).j?.data);const leads=mods.find(m=>(m.apiName||m.api_name)==='leads');out.leadsMod=leads&&leads.id;
const ts=Date.now().toString(36);const email=`qa.rt2392.lead.${ts}@example.com`;out.email=email;
const sv=v=>({kind:'string',value:v});
const lr=await crm('POST',`/modules/${leads.id}/records`,{data:[{field:'first_name',value:sv('QA RT 2392 Lead '+ts)},{field:'last_name',value:sv('QA RT 2392 Lead '+ts)},{field:'email',value:sv(email)}]});
out.lead={s:lr.s,t:lr.t.slice(0,300)};const leadId=lr.j?.data?.id||lr.j?.data?.[0]?.id;out.leadId=leadId;if(leadId)led(`CRM lead created ${leadId} (QA RT 2392 Lead ${ts}, ${email})`);
if(!leadId) return out;
const DC='43004ce2-577f-4eda-b00a-0750fe40c3d4';
const dr=await api('POST',`/modules/${DC}/records`,{data:[{field:'last_name',value:sv('QA RT 2392 Contact '+ts)},{field:'email',value:sv(email)}]});
out.desk={s:dr.s,t:dr.t.slice(0,300)};const dId=dr.j?.data?.id||dr.j?.data?.[0]?.id;out.deskId=dId;if(dId)led(`Desk contact created ${dId} (QA RT 2392 Contact ${ts})`);
await sleep(45000);
const links=arr((await api('GET','/desk/integrations/crm/links?limit=200')).j?.data).filter(x=>x.desk_record_id===dId);out.links=links.map(x=>({crm:x.crm_record_id,mod:x.crm_module_key,status:x.sync_status,miss:x.missing_fields}));
const fl=await api('GET','/desk/integrations/crm/failures?limit=50');out.failures=arr(fl.j?.data).filter(x=>JSON.stringify(x).includes(dId||'none')).map(x=>({reason:x.reason||x.reason_code,status:x.status})).slice(0,3);
for(const x of links){if(x.crm_module_key==='contacts'){led(`CRM contact created by sync ${x.crm_record_id} (twin of ${dId})`);}}
fs.writeFileSync(L+'raw/w1.json',JSON.stringify(out,null,1));
return out;
