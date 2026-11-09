eval(require('fs').readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-backlog/scripts/lib.js','utf8'));
const o={};
o.a_noStatus=await mkTicket('QA RT9 2174 A no status');
if(o.a_noStatus.id){const g=await getT(o.a_noStatus.id);o.a_read={status:g.status,dept:g.department,layout:g.layout_id||g.layout||null,keys:Object.keys(g).filter(k=>/layout/i.test(k))};}
o.b_onHold=await mkTicket('QA RT9 2174 B On Hold',{status:'On Hold'});
if(o.b_onHold.id){o.b_read=(await getT(o.b_onHold.id)).status;}
o.c_open=await mkTicket('QA RT9 2174 C Open',{status:'Open'});
const id=o.c_open.id;
if(id){o.c_toOnHold=await patchT(id,{status:'On Hold'});o.c_afterOnHold=(await getT(id)).status;
 o.c_toNdcPending=await patchT(id,{status:'QA NDC Pending'});o.c_afterPending=(await getT(id)).status;
 o.c_toClosed=await patchT(id,{status:'Closed'});o.c_afterClosed=(await getT(id)).status;}
return o;
