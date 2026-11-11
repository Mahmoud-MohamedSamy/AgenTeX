const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-10_retest-mahmoudmohamed-r15';
const LED=m=>fs.appendFileSync(RUN+'/ledger.md','- '+new Date().toISOString().slice(0,19)+' DESK '+m+'\n');
const AO='93949fbd-f9df-4e2e-ae45-00b8dc38385b', T='88e8ea44-1658-4df3-9930-d0902b91073d';
const E=r=>r.j&&r.j.error?r.j.error.code+': '+r.j.error.message+' '+JSON.stringify(r.j.error.details||'').slice(0,300):'';
const trig={create:true,update:false,field_update:null,customer_reply:false,agent_response:false,private_thread:null,comment:null};
const mkT=(name,conds)=>({name,criteria:{conditions:conds,pattern:null},response:{value:30,unit:'minutes'},resolution:{value:2,unit:'hours'},calendar_mode:'calendar',business_hours_id:null});
const out={};
let r = await api('POST','/desk/sla/policies',{department_id:AO,name:'QA RT15 2826 SLA',description:null,is_active:true,triggers:trig,execute_only_with_account:false,resolution_from_created:false,targets:[
  mkT('amount > 1000',[{field_key:'subject',operator:'contains',value:'QA RT15 2826'},{field_key:'qa_ndc_amount',operator:'greater_than',value:1000}]),
  mkT('due date after 2027-01-01',[{field_key:'subject',operator:'contains',value:'QA RT15 2826 date'},{field_key:'due_date',operator:'is_after',value:'2027-01-01'}])]});
const pid=r.j&&r.j.data&&r.j.data.id; out.policy={s:r.s,e:E(r),id:pid}; if(pid) LED('SLA policy "QA RT15 2826 SLA" '+pid);
if(!pid) return out;
const S=v=>({kind:'string',value:v}), N=v=>({kind:'number',value:v});
const mk=async (subject, extra)=>{ const x=await api('POST','/modules/'+T+'/records',{data:[{field:'subject',value:S(subject)},{field:'department',value:S(AO)},{field:'status',value:S('Open')},...extra]}); const id=x.j&&x.j.data&&x.j.data.id; if(id) LED('ticket "'+subject+'" '+id); return {s:x.s,id,e:E(x)}; };
out.t1500 = await mk('QA RT15 2826 amount 1500',[{field:'qa_ndc_amount',value:N(1500)}]);
out.t500 = await mk('QA RT15 2826 amount 500',[{field:'qa_ndc_amount',value:N(500)}]);
out.tDateLate = await mk('QA RT15 2826 date late',[{field:'due_date',value:S('2027-03-01T10:00:00Z')}]);
out.tDateEarly = await mk('QA RT15 2826 date early',[{field:'due_date',value:S('2026-12-01T10:00:00Z')}]);
await sleep(20000);
for (const k of ['t1500','t500','tDateLate','tDateEarly']) { if(!out[k].id) continue; const s=(await api('GET','/desk/tickets/'+out[k].id+'/sla')).j; const d=s&&s.data; out[k].sla = d ? {state:d.state, policy:d.policy&&d.policy.name, target:d.target&&d.target.name} : s; }
return out;
