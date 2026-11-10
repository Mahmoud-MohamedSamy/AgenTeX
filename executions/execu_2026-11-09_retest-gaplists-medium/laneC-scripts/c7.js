const fs=require('fs');const L='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-2635/ledger.md';
const TM='d120a6c2-2596-4254-968b-a1bcd3a000bf',TK='88e8ea44-1658-4df3-9930-d0902b91073d';
const deps=arr((await api('GET','/desk/departments')).j);const B=deps.find(x=>x.name==='QA AS6 Dept B');
const out={};
// a ticket in Dept B?
const tq=await api('GET',`/modules/${TK}/records?pageSize=100`);const tks=arr(tq.j);const v=(r,f)=>{const x=(r.data||[]).find(z=>z.field===f);return x&&x.value&&x.value.value};
out.ticketsSeen=tks.length;out.ticketDepts=[...new Set(tks.map(t=>v(t,'department')))].length;
const tB=tks.find(t=>String(v(t,'department'))===String(B.id));out.ticketInDeptBVisibleInList=!!tB;
const r=await api('POST',`/modules/${TM}/records`,{data:[{field:'subject',value:{kind:'string',value:'QA RT 2635 dept visibility'}},{field:'department',value:{kind:'string',value:B.id}},{field:'status',value:{kind:'string',value:'Not Started'}}]});
out.create=r.s;out.createErr=r.s>=300?r.t.slice(0,300):undefined;const id=r.j&&r.j.data&&(r.j.data.id||r.j.data.recordId);out.id=id;
if(id){fs.appendFileSync(L,`- ${new Date().toISOString()} CREATED task ${id} (QA RT 2635 dept visibility, department QA AS6 Dept B where index 8 is not an agent)\n`);const g=await api('GET',`/modules/${TM}/records/${id}`);out.getAsNonMember=g.s;out.deptStored=v(g.j&&g.j.data||{},'department')===B.id;}
return out;
