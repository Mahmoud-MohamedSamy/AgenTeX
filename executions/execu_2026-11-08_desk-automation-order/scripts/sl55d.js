// SL-55 final: role-only recipient, ticket assigned to Mahmoud Samy (a Manager-role agent in Dept A). Then deletes all SL-55 data.
const A='93949fbd-f9df-4e2e-ae45-00b8dc38385b',M='88e8ea44-1658-4df3-9930-d0902b91073d',MGR='d46e0424-fd6f-914e-b4cf-f1597f7cbdcd',SAMY='d23fb4e0-248d-41f6-af60-d28885a7007e';
const f=(k,v)=>({field:k,value:{kind:'string',value:v}});const u=Math.random().toString(36).slice(2,6),tag='SL55o'+u;const R={tag};
const lvl={timing:'at',offset:null,recipients:[{kind:'role',id:MGR}],template_ref:null,actions:{assign_owner:null,assign_team:null,set_priority:null}};
const p=await api('POST','/desk/sla/policies',{department_id:A,name:'QA AO '+tag,description:null,is_active:true,triggers:{create:true,update:false,field_update:null,customer_reply:false,agent_response:false,private_thread:null,comment:null},execute_only_with_account:false,resolution_from_created:false,targets:[{name:'t '+tag,criteria:{conditions:[{field_key:'description',operator:'contains',value:tag}],pattern:null},response:{value:1,unit:'minutes'},resolution:{value:2,unit:'hours'},calendar_mode:'calendar',business_hours_id:null,first_response_only:true,escalate_on_business_hours:false,escalations:{response:[lvl],resolution:[]}}]});
const pid=p.j?.data?.id;R.policy=p.s;
const t=await api('POST','/modules/'+M+'/records',{data:[f('subject','QA AO '+tag),f('description','QA AO '+tag),f('department',A),f('status','Open'),f('priority','high')]});const id=t.j?.data?.id;
R.assign=(await api('POST','/desk/tickets/'+id+'/assign',{owner_id:SAMY,team_id:null})).s;
await sleep(150000);
const j=(await api('GET','/desk/tickets/'+id+'/activity')).j;const L=Array.isArray(j?.data)?j.data:(j?.data?.items||[]);
const e=L.find(x=>x.action==='sla.escalation_fired');
R.actions=(e?.summary?.actions||[]).map(a=>(a.to===SAMY?'Samy':(a.to||'null').slice(0,8))+' '+a.kind+' '+a.outcome+' '+(a.reason||''));
const M2=M;R.cleanup=[];
for(const [k,path] of [['t3',id],['t2','00158952-2ec0-46c3-a275-cd169677fb8f'],['t1','bbec2b2f-a2a8-43dd-8ab0-04ab240cb38f']])R.cleanup.push(k+' '+(await api('DELETE','/modules/'+M2+'/records/'+path)).s);
for(const pp of [pid,'d1a79109-4886-4c28-9191-28148e533c6f','999195d6-d0e3-424d-856c-657497b76026'])R.cleanup.push('p '+(await api('DELETE','/desk/sla/policies/'+pp)).s);
return R;
