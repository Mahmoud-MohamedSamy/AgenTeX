const fs=require('fs');const L='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-1865/functional/laneH/ledger.md';const log=s=>fs.appendFileSync(L,`- ${new Date().toISOString()} ${s}\n`);
const TK='88e8ea44-1658-4df3-9930-d0902b91073d',CT='43004ce2-577f-4eda-b00a-0750fe40c3d4',EV='6fb19115-9356-40f0-b064-840d8f1fad93',TM='d120a6c2-2596-4254-968b-a1bcd3a000bf',CL='f7e488b5-0232-42fd-811c-1f24356af653';const S=v=>({kind:'string',value:v});const out={};
const T='5254adb3-80f2-4c12-9c6e-e7e7a1c7150a';
// close ticket (feature 12 close)
const cl=await api('PATCH',`/modules/${TK}/records/${T}`,{data:[{field:'status',value:S('Closed')}]});out.close=cl.s+(cl.s>=300?' '+cl.t.slice(0,200):'');log(`UPDATE ticket #2484 status Closed (close-ticket check; rule contact.ticket_closed is on → closed mail may go to mmohamed@anyware.software) → ${cl.s}`);
const g=await api('GET',`/modules/${TK}/records/${T}`);out.statusAfter=JSON.stringify(((g.j&&g.j.data&&g.j.data.data)||[]).filter(z=>z.field==='status'));
// import sessions
for(const p of [`/modules/${CT}/import`,`/modules/${CT}/imports`,`/modules/${CT}/import/sessions`,`/data-import/sessions`,`/modules/${CT}/import/current`]){const r=await api('GET',p);out['GET '+p]=r.s+' '+r.t.slice(0,300);}
return out;
