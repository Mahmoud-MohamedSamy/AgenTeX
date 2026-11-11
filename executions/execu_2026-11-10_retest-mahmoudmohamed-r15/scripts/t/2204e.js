const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-10_retest-mahmoudmohamed-r15';
const LED=m=>fs.appendFileSync(RUN+'/ledger.md','- '+new Date().toISOString().slice(0,19)+' DESK '+m+'\n');
const T='88e8ea44-1658-4df3-9930-d0902b91073d'; const E=r=>r.j&&r.j.error?r.j.error.code+': '+r.j.error.message+' '+JSON.stringify(r.j.error.details||'').slice(0,400):'';
const CEO='7972984b-b5cc-034a-bd96-6de61e3937d0';
const SM=(f,op,v)=>({kind:'StringMatch',field:f,operator:op,stringValue:v,caseInsensitive:false});
const crit={kind:'Logical',operator:'And',operands:[SM('subject','StartsWith','QA RT15 2204')]};
const base={fieldName:null,dateFieldName:null,offsetSeconds:null,offsetMode:null};
const out={};
for (const kind of ['OrgUnitRoundRobin']) {
  const r = await api('POST','/workflow/rules',{moduleId:T,layoutId:'',name:'QA RT15 2204 role owner',description:'QA RT15 retest NDC-2204 - safe to delete',mode:'Recurring',isActive:true,trigger:{...base,kind:'RecordCreated'},criteria:crit,actions:[{type:'OwnerAssignment',order:0,delaySeconds:0,ownerTargetKind:kind,ownerValue:CEO,ownerOnlyOnlineUsers:false}]});
  out[kind]={s:r.s,e:E(r),id:r.j&&r.j.data&&r.j.data.id}; if (out[kind].id) { LED('workflow rule "QA RT15 2204 role owner" (active) '+out[kind].id); break; }
}
return out;
