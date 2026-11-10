const fs=require('fs');const L='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-1865/functional/laneH/ledger.md';const ts=()=>new Date().toISOString();const log=s=>fs.appendFileSync(L,`- ${ts()} ${s}\n`);
const TK='88e8ea44-1658-4df3-9930-d0902b91073d',EV='6fb19115-9356-40f0-b064-840d8f1fad93',TM='d120a6c2-2596-4254-968b-a1bcd3a000bf',CL='f7e488b5-0232-42fd-811c-1f24356af653';
const S=v=>({kind:'string',value:v});const idOf=r=>r.j&&r.j.data&&(r.j.data.id||r.j.data.recordId);
const TECH='19510fdc-91f3-4a7a-8888-153f1318b765',C='de7195a2-369e-48c5-b03f-b8e37d6c5fb2';const out={};
const t=await api('POST',`/modules/${TK}/records`,{data:[{field:'subject',value:S('QA FT 1865 H reply check')},{field:'department',value:S(TECH)},{field:'status',value:S('Open')},{field:'contact_id',value:S(C)},{field:'description',value:S('QA test ticket for NDC-1865 functional check. Please ignore.')}]});
out.ticket=t.s+(t.s>=300?' '+t.t.slice(0,300):'');const T=idOf(t);out.T=T;if(T)log(`CREATED ticket ${T} (QA FT 1865 H reply check, dept Tech, contact de7195a2 mmohamed@anyware.software — existing contact, not ours) → ${t.s}`);
if(!T)return out;
const g=await api('GET',`/modules/${TK}/records/${T}`);out.ticketNo=JSON.stringify(((g.j&&g.j.data&&g.j.data.data)||[]).filter(z=>/number|status|owner/.test(z.field)).map(z=>z.field+'='+JSON.stringify(z.value&&z.value.value))).slice(0,300);
const mk=async(M,k,d)=>{const r=await api('POST',`/modules/${M}/records`,{data:d});const id=idOf(r);out[k]=r.s+(r.s>=300?' '+r.t.slice(0,300):'');if(id){out[k+'Id']=id;log(`CREATED ${k} ${id} (ticket ${T}) → ${r.s}`);}return id;};
const due=new Date(Date.now()+2*86400000).toISOString();
const task=await mk(TM,'task',[{field:'subject',value:S('QA FT 1865 H task')},{field:'department',value:S(TECH)},{field:'status',value:S('Not Started')},{field:'ticket_id',value:S(T)},{field:'contact_id',value:S(C)},{field:'due_date',value:S(due)}]);
const call=await mk(CL,'call',[{field:'subject',value:S('QA FT 1865 H call')},{field:'department',value:S(TECH)},{field:'call_type',value:S('Outbound')},{field:'call_status',value:S('Scheduled')},{field:'call_start_time',value:S(due)},{field:'contact_id',value:S(C)},{field:'ticket_id',value:S(T)}]);
const ev=await mk(EV,'event',[{field:'title',value:S('QA FT 1865 H event')},{field:'department',value:S(TECH)},{field:'from_time',value:S(due)},{field:'to_time',value:S(new Date(Date.now()+2*86400000+3600000).toISOString())},{field:'contact_id',value:S(C)},{field:'ticket_id',value:S(T)}]);
if(task){const e=await api('PATCH',`/modules/${TM}/records/${task}`,{data:[{field:'subject',value:S('QA FT 1865 H task edited')},{field:'priority',value:S('High')}]});out.taskEdit=e.s+(e.s>=300?' '+e.t.slice(0,200):'');
 if(e.s>=300){const e2=await api('PUT',`/modules/${TM}/records/${task}`,{data:[{field:'subject',value:S('QA FT 1865 H task edited')}]});out.taskEditPut=e2.s+(e2.s>=300?' '+e2.t.slice(0,200):'');}
 const c=await api('PATCH',`/modules/${TM}/records/${task}`,{data:[{field:'status',value:S('Completed')}]});out.taskComplete=c.s+(c.s>=300?' '+c.t.slice(0,200):'');
 const r=await api('GET',`/modules/${TM}/records/${task}`);out.taskAfter=JSON.stringify(((r.j&&r.j.data&&r.j.data.data)||[]).filter(z=>/subject|status|completed_time|priority/.test(z.field)).map(z=>z.field+'='+JSON.stringify(z.value&&z.value.value)));}
if(ev){const d=await api('DELETE',`/modules/${EV}/records/${ev}`);out.eventDelete=d.s;log(`DELETE event ${ev} (feature test: delete one activity) → ${d.s}`);}
return out;
