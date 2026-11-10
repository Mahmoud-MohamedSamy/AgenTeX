const fs=require('fs');const L='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-1865/functional/laneH/ledger.md';const log=s=>fs.appendFileSync(L,`- ${new Date().toISOString()} ${s}\n`);
const CT='43004ce2-577f-4eda-b00a-0750fe40c3d4',EV='6fb19115-9356-40f0-b064-840d8f1fad93';const S=v=>({kind:'string',value:v});const out={};
// Recycle bin restore of the deleted event
const bin=arr((await api('GET','/audit/recycle-bin/items')).j);const it=bin.find(i=>JSON.stringify(i).includes('6b4edebe-109d-4c22-a2af-51be30b6403b'));out.binItem=it?JSON.stringify(it).slice(0,300):'not found';
if(it){for(const [p,b] of [['/audit/recycle-bin/restore',{ids:[it.id]}],['/audit/recycle-bin/items/'+it.id+'/restore',{}]]){const r=await api('POST',p,b);out['restore '+p]=r.s+' '+r.t.slice(0,200);if(r.s<300){log(`RESTORE event 6b4edebe from bin (${p}) → ${r.s}`);break;}}
 const g=await api('GET',`/modules/${EV}/records/6b4edebe-109d-4c22-a2af-51be30b6403b`);out.eventAfterRestore=g.s;}
// Audit log
const a=await api('GET','/audit/events?limit=50');const ev=arr(a.j);out.auditCount=ev.length;out.auditMine=ev.filter(e=>/QA FT 1865 H|5254adb3|6b4edebe|615ea9fb/.test(JSON.stringify(e))).map(e=>(e.action||e.event_type||e.type)+' '+(e.entity_type||e.resource_type||'')+' '+(e.created_at||e.occurred_at||'')).slice(0,8);out.auditKeys=Object.keys(ev[0]||{}).join(',');
// CRM sync: create contact
const c=await api('POST',`/modules/${CT}/records`,{data:[{field:'first_name',value:S('QA')},{field:'last_name',value:S('QA FT 1865 H Sync')},{field:'phone',value:S('+201000001865')}]});const cid=c.j&&c.j.data&&(c.j.data.id||c.j.data.recordId);out.contact=c.s+' '+cid;if(cid)log(`CREATED contact ${cid} (QA FT 1865 H Sync, no email) for CRM sync check → ${c.s}`);
// parked reasons
let fails=[];let page2=1;for(;page2<=10;page2++){const f=await api('GET','/desk/integrations/crm/failures?page='+page2+'&page_size=100');const d=arr(f.j);if(!d.length)break;fails=fails.concat(d);if(d.length<100)break;}
out.failTotal=fails.length;out.failMeta=JSON.stringify((await api('GET','/desk/integrations/crm/failures')).j.meta||{}).slice(0,200);
const norm=s=>String(s||'').replace(/"[^"]*"/g,'"…"').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g,'<id>').replace(/\d+/g,'N').slice(0,140);
const grp={};for(const x of fails){const k=(x.kind||'')+' '+(x.module_key||'')+' :: '+norm(x.last_error);grp[k]=(grp[k]||0)+1;}out.reasons=Object.entries(grp).sort((a,b)=>b[1]-a[1]).slice(0,10);
await sleep(120000);
const g=await api('GET',`/modules/${CT}/records/${cid}`);out.syncFields=JSON.stringify(((g.j&&g.j.data&&g.j.data.data)||[]).filter(z=>/crm|sync|external/i.test(z.field))).slice(0,400);
out.syncMeta=JSON.stringify(Object.fromEntries(Object.entries((g.j&&g.j.data)||{}).filter(([k])=>/crm|sync|link|external|pair/i.test(k)))).slice(0,300);
const f2=arr((await api('GET','/desk/integrations/crm/failures?page_size=100')).j).filter(x=>x.record_id===cid);out.ourFailure=f2.map(x=>x.last_error).slice(0,2);
for(const p of ['/desk/integrations/crm/customers?search=QA%20FT%201865','/desk/integrations/crm/links?record_id='+cid,'/desk/integrations/crm/records/contacts/'+cid,'/desk/integrations/crm/sync-history?page_size=20']){const r=await api('GET',p);out[p]=r.s+' '+r.t.slice(0,350);}
return out;
