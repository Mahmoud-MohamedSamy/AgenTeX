eval(require('fs').readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-backlog/scripts/lib.js','utf8'));
const o={};
const a=await mkTicket('QA RT9 2174 E round up',{status:'Open',qa_rt9_round:12.345});o.a={s:a.s,e:a.e,round:a.o&&a.o.qa_rt9_round,def:a.o&&a.o.qa_rt9_default};
if(a.id){const g=await getT(a.id);o.a.read={round:g.qa_rt9_round,def:g.qa_rt9_default};}
const b=await mkTicket('QA RT9 2174 F round down',{status:'Open',qa_rt9_round:7.3449});if(b.id){const g=await getT(b.id);o.b={round:g.qa_rt9_round,def:g.qa_rt9_default};}else o.b=b;
const c=await mkTicket('QA RT9 2174 G given default',{status:'Open',qa_rt9_default:'typed value'});if(c.id){const g=await getT(c.id);o.c={def:g.qa_rt9_default};}else o.c=c;
if(a.id){o.patch=await patchT(a.id,{qa_rt9_round:1.005});o.patchRead=(await getT(a.id)).qa_rt9_round;}
return o;
