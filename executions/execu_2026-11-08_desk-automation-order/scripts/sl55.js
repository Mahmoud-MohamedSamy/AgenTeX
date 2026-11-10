// SL-55: response escalation to a role (Manager org unit). QA AO Dept A. Keeps policy+ticket for the bell check; ids in the result.
const A='93949fbd-f9df-4e2e-ae45-00b8dc38385b',M='88e8ea44-1658-4df3-9930-d0902b91073d',MGR='d46e0424-fd6f-914e-b4cf-f1597f7cbdcd';
const f=(k,v)=>({field:k,value:{kind:'string',value:v}});const u=Math.random().toString(36).slice(2,6),tag='SL55'+u;const R={tag};
const lvl={timing:'at',offset:null,recipients:[{kind:'role',id:MGR}],template_ref:null,actions:{assign_owner:null,assign_team:null,set_priority:null}};
const p=await api('POST','/desk/sla/policies',{department_id:A,name:'QA AO '+tag,description:null,is_active:true,triggers:{create:true,update:false,field_update:null,customer_reply:false,agent_response:false,private_thread:null,comment:null},execute_only_with_account:false,resolution_from_created:false,targets:[{name:'t '+tag,criteria:{conditions:[{field_key:'description',operator:'contains',value:tag}],pattern:null},response:{value:1,unit:'minutes'},resolution:{value:2,unit:'hours'},calendar_mode:'calendar',business_hours_id:null,first_response_only:true,escalate_on_business_hours:false,escalations:{response:[lvl],resolution:[]}}]});
R.policy=p.s+(p.s>=300?' '+p.t.slice(0,300):'');R.policyId=p.j?.data?.id;
if(R.policyId){R.savedRecipients=JSON.stringify((await api('GET','/desk/sla/policies/'+R.policyId)).j?.data?.targets?.[0]?.escalations?.response?.[0]?.recipients);
const t=await api('POST','/modules/'+M+'/records',{data:[f('subject','QA AO '+tag),f('description','QA AO '+tag),f('department',A),f('status','Open'),f('priority','high')]});R.ticketId=t.j?.data?.id;
await sleep(150000);
const s=(await api('GET','/desk/tickets/'+R.ticketId+'/sla')).j?.data;const fr=(s?.obligations||[]).find(o=>o.kind==='first_response')||{};
R.level=fr.escalation_level_reached;R.breached=fr.breached_at;
R.events=(JSON.stringify((await api('GET','/desk/tickets/'+R.ticketId+'/activity')).j).match(/"action":"sla\.escalation[^}]*\}[^}]*\}[^}]*\}/g)||[]).map(x=>x.replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+/g,'<email>').slice(0,900));}
return R;
