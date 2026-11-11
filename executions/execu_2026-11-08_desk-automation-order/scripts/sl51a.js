// SL-51 delete case, part 1: throwaway agent (accepted invite) → QA AO Dept A → named in an SLA escalation. Saves ids to ../sl51.json.
const AO='93949fbd-f9df-4e2e-ae45-00b8dc38385b',U1='48f1cdbb-a6a3-4ec1-885f-adfff50b7729',SAMY='d23fb4e0-248d-41f6-af60-d28885a7007e';const R={};const S={};
const us=await api('GET','/iam/users?limit=200');const me=(us.j?.data?.data||us.j?.data||us.j?.items||[]).find?.(x=>(x.id||x.user_id)===U1);R.userFound=!!me;R.userStatus=me&&(me.status||me.state);R.listKeys=Object.keys(us.j||{}).join(',');
const d0=(await api('GET','/desk/departments/'+AO)).j.data;S.ag0=d0.agent_user_ids;R.wasMember=S.ag0.includes(U1);
const add=await api('PUT','/desk/departments/'+AO+'/agents',{agent_user_ids:[...new Set([...S.ag0,U1])]});R.add=add.s+' '+(add.s>=300?add.t.slice(0,250):'');
R.memberNow=(await api('GET','/desk/departments/'+AO)).j.data.agent_user_ids.includes(U1);
const tag='SL51d'+Math.random().toString(36).slice(2,6);S.tag=tag;
const lvl=(timing,min,rc)=>({timing,offset:timing==='at'?null:{value:min,unit:'minutes'},recipients:rc,template_ref:null,actions:{assign_owner:null,assign_team:null,set_priority:null}});
const p=await api('POST','/desk/sla/policies',{department_id:AO,name:'QA AO '+tag,description:null,is_active:true,triggers:{create:true,update:false,field_update:null,customer_reply:false,agent_response:false,private_thread:null,comment:null},execute_only_with_account:false,resolution_from_created:false,targets:[{name:'t '+tag,criteria:{conditions:[{field_key:'description',operator:'contains',value:tag}],pattern:null},response:{value:1,unit:'hours'},resolution:{value:2,unit:'hours'},calendar_mode:'calendar',business_hours_id:null,first_response_only:true,escalate_on_business_hours:false,escalations:{response:[lvl('at',null,[{kind:'agent',id:U1}]),lvl('after',30,[{kind:'agent',id:U1},{kind:'agent',id:SAMY}])],resolution:[]}}]});
R.policy=p.s+' '+(p.s>=300?p.t.slice(0,300):'');S.pid=p.j?.data?.id;
if(S.pid){const g=(await api('GET','/desk/sla/policies/'+S.pid)).t;R.recipients=(g.match(/"recipients":\[[^\]]*\]/g)||[]).join(' | ');}
fs.writeFileSync('../sl51.json',JSON.stringify(S,null,1));
fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+' SL-51: throwaway added to QA AO Dept A; SLA policy "QA AO '+tag+'" '+(S.pid||'none')+' names it in escalations. Delete both after.\n');
return R;
