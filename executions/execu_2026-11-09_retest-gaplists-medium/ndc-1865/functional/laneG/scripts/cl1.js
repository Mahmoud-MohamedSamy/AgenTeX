var RUNP='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-1865/functional/laneG';
eval(require('fs').readFileSync(RUNP+'/scripts/lib.js','utf8'));
// Cleanup strictly by ledger ids (ids.json mirrors the ledger)
const o={del:{}};
const D=async(label,p)=>{const r=await api('DELETE',p);o.del[label]=r.s+(r.s>=300?' '+(E(r)||r.t.slice(0,120)):'');LED('CLEANUP delete '+label+': '+r.s);return r.s;};
for(const id of IDS.tickets)await D('ticket '+id.slice(0,8),'/modules/'+T+'/records/'+id);
if(IDS.bp)await D('blueprint','/modules/'+T+'/blueprints/'+IDS.bp);
if(IDS.sla)await D('sla policy','/desk/sla/policies/'+IDS.sla);
for(const id of IDS.wf||[])await D('workflow rule '+id.slice(0,8),'/workflow/rules/'+id);
if(IDS.wfAction)await D('workflow action','/workflow/actions/'+IDS.wfAction);
if(IDS.tag)await D('tag','/desk/tags/'+IDS.tag);
for(const id of IDS.rules||[])await D('assignment rule '+id.slice(0,8),'/desk/assignment-rules/'+id);
if(IDS.layout)await D('layout','/modules/'+T+'/layouts/'+IDS.layout);
for(const f of [IDS.fTxt,IDS.fPick])if(f)await D('field '+f.slice(0,8),'/modules/'+T+'/fields/'+f);
return o;
