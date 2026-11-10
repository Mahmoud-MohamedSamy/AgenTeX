const fs=require('fs');const L='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/bugs-draft/ledger.md';const ts=()=>new Date().toISOString();
const TM='d120a6c2-2596-4254-968b-a1bcd3a000bf',CL='f7e488b5-0232-42fd-811c-1f24356af653';const S=v=>({kind:'string',value:v});const idOf=r=>r.j&&r.j.data&&(r.j.data.id||r.j.data.recordId);
const HR='08fd8684-c5c0-4d4d-86f9-2be70cf61e53',T='372b88df-6733-4c61-a774-0202a0148fd5',C='daf6afa2-d952-41f6-afbb-f7223e49408a';const out={};
const a=await api('POST',`/modules/${TM}/records`,{data:[{field:'subject',value:S('QA RT BUG dept task')},{field:'department',value:S(HR)},{field:'status',value:S('Not Started')},{field:'ticket_id',value:S(T)}]});
out.task=a.s;out.taskErr=a.s>=300?a.t.slice(0,300):undefined;const tid=idOf(a);out.taskId=tid;if(tid)fs.appendFileSync(L,`- ${ts()} CREATED task ${tid} (QA RT BUG dept task, dept HR, ticket ${T}) → ${a.s}\n`);
const b=await api('POST',`/modules/${CL}/records`,{data:[{field:'subject',value:S('QA RT BUG dept call')},{field:'department',value:S(HR)},{field:'call_type',value:S('Outbound')},{field:'call_status',value:S('Scheduled')},{field:'call_start_time',value:{kind:'string',value:new Date(Date.now()+86400000).toISOString()}},{field:'contact_id',value:S(C)},{field:'ticket_id',value:S(T)}]});
out.call=b.s;out.callErr=b.s>=300?b.t.slice(0,400):undefined;const cid=idOf(b);out.callId=cid;if(cid)fs.appendFileSync(L,`- ${ts()} CREATED call ${cid} (QA RT BUG dept call, dept HR, ticket ${T}) → ${b.s}\n`);
return out;
