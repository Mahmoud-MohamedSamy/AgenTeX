// SL-55 control: same setup, recipients = role Manager + agent Mahmoud Samy + agent Test User 1. Shows whether "no_access" is about the role kind or the agents.
const A='93949fbd-f9df-4e2e-ae45-00b8dc38385b',M='88e8ea44-1658-4df3-9930-d0902b91073d',MGR='d46e0424-fd6f-914e-b4cf-f1597f7cbdcd',SAMY='d23fb4e0-248d-41f6-af60-d28885a7007e',TU1='876ce871-2b02-4854-89a7-68050391c62b';
const f=(k,v)=>({field:k,value:{kind:'string',value:v}});const u=Math.random().toString(36).slice(2,6),tag='SL55k'+u;const R={tag};
const lvl={timing:'at',offset:null,recipients:[{kind:'agent',id:SAMY},{kind:'agent',id:TU1},{kind:'role',id:MGR}],template_ref:null,actions:{assign_owner:null,assign_team:null,set_priority:null}};
const p=await api('POST','/desk/sla/policies',{department_id:A,name:'QA AO '+tag,description:null,is_active:true,triggers:{create:true,update:false,field_update:null,customer_reply:false,agent_response:false,private_thread:null,comment:null},execute_only_with_account:false,resolution_from_created:false,targets:[{name:'t '+tag,criteria:{conditions:[{field_key:'description',operator:'contains',value:tag}],pattern:null},response:{value:1,unit:'minutes'},resolution:{value:2,unit:'hours'},calendar_mode:'calendar',business_hours_id:null,first_response_only:true,escalate_on_business_hours:false,escalations:{response:[lvl],resolution:[]}}]});
R.policyId=p.j?.data?.id;R.policy=p.s;
const t=await api('POST','/modules/'+M+'/records',{data:[f('subject','QA AO '+tag),f('description','QA AO '+tag),f('department',A),f('status','Open'),f('priority','high')]});R.ticketId=t.j?.data?.id;
await sleep(150000);
const j=(await api('GET','/desk/tickets/'+R.ticketId+'/activity')).j;const L=Array.isArray(j?.data)?j.data:(j?.data?.items||[]);
const e=L.find(x=>x.action==='sla.escalation_fired');const nm={[SAMY]:'Samy',[TU1]:'TestUser1'};
R.actions=(e?.summary?.actions||[]).map(a=>(nm[a.to]||(a.to||'null').slice(0,8))+' '+a.kind+' '+a.outcome+' '+(a.reason||''));
return R;
