const fs=require('fs');const L='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/bugs-draft/ledger.md';const ts=()=>new Date().toISOString();
const CT='43004ce2-577f-4eda-b00a-0750fe40c3d4',TK='88e8ea44-1658-4df3-9930-d0902b91073d',TM='d120a6c2-2596-4254-968b-a1bcd3a000bf',CL='f7e488b5-0232-42fd-811c-1f24356af653';
const S=v=>({kind:'string',value:v});const idOf=r=>r.j&&r.j.data&&(r.j.data.id||r.j.data.recordId);
const out={};const deps=arr((await api('GET','/desk/departments')).j);const hr=deps.find(x=>x.name==='HR');out.hr=hr.id;
for(const M of [TM,CL]){const f=arr((await api('GET','/modules/'+M+'/fields')).j);out['f_'+M.slice(0,4)]=f.filter(z=>z.required||/ticket|related|what|depart|owner|contact/i.test(z.api_name||'')).map(z=>(z.api_name)+':'+(z.data_type||z.type||'')+(z.required?'*':''));}
// contact
const c=await api('POST',`/modules/${CT}/records`,{data:[{field:'last_name',value:S('QA RT BUG Contact')},{field:'name',value:S('QA RT BUG Contact')},{field:'email',value:S('qa.rt2636@example.com')}]});
out.contact=c.s;out.contactErr=c.s>=300?c.t.slice(0,300):undefined;const cid=idOf(c);out.cid=cid;if(cid)fs.appendFileSync(L,`- ${ts()} CREATED contact ${cid} (QA RT BUG Contact, email qa.rt2636@example.com) → ${c.s}\n`);
// ticket
const t=await api('POST',`/modules/${TK}/records`,{data:[{field:'subject',value:S('QA RT BUG composer check')},{field:'department',value:S(hr.id)},{field:'status',value:S('Open')},...(cid?[{field:'contact_id',value:S(cid)}]:[])]});
out.ticket=t.s;out.ticketErr=t.s>=300?t.t.slice(0,300):undefined;const tid=idOf(t);out.tid=tid;if(tid)fs.appendFileSync(L,`- ${ts()} CREATED ticket ${tid} (QA RT BUG composer check, dept HR, contact ${cid}) → ${t.s}\n`);
if(tid){const g=await api('GET',`/modules/${TK}/records/${tid}`);out.ticketEmail=JSON.stringify(((g.j&&g.j.data&&g.j.data.data)||[]).filter(z=>/email|contact|number/.test(z.field))).slice(0,400);}
return out;
