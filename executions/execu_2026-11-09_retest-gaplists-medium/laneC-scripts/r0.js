const fs=require('fs');const L='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-2636/ledger.md';
const TK='88e8ea44-1658-4df3-9930-d0902b91073d';
const deps=arr((await api('GET','/desk/departments')).j);const hr=deps.find(x=>x.name==='HR');
const r=await api('POST',`/modules/${TK}/records`,{data:[{field:'subject',value:{kind:'string',value:'QA RT 2636 replies check'}},{field:'department',value:{kind:'string',value:hr.id}},{field:'status',value:{kind:'string',value:'Open'}}]});
const id=r.j&&r.j.data&&(r.j.data.id||r.j.data.recordId);
if(id)fs.appendFileSync(L,`- ${new Date().toISOString()} CREATED ticket ${id} (QA RT 2636 replies check, dept HR, no contact)\n`);
return {s:r.s,id,err:r.s>=300?r.t.slice(0,400):undefined,hrChannels:JSON.stringify(hr.channels||'').slice(0,200)};
