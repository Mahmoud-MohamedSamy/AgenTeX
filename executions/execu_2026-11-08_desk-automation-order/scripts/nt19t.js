// NT-19 team half (user OK 11 Nov "NT-19 go ahead"): a direct rule assigns tickets to team TeamA in QA AS6 Dept A.
// Team notice switch off -> ticket 1; on -> ticket 2. Direct master switch on only during the test; all switches restored in finally.
const DA='b3cd7c28-7879-42b1-b7a9-06bc9bf64aa6',T='88e8ea44-1658-4df3-9930-d0902b91073d',TEAM='434140a3-2145-428c-9e57-e6bc5cf2f8d0';
const u=Math.random().toString(36).slice(2,6);const R={u};const made={rules:[],tickets:[]};const f=(k,v)=>({field:k,value:{kind:'string',value:v}});
const tm=(await api('GET','/desk/teams/'+TEAM)).j?.data;R.team={name:tm?.name,members:tm?.member_user_ids||tm?.members?.map?.(m=>m.user_id||m.id)};
const orig=(await api('GET','/desk/assignment/notification-settings')).j?.data;R.orig=orig;fs.writeFileSync('../nt19t-orig.json',JSON.stringify(orig));
const tk=async(key)=>{const r=await api('POST','/modules/'+T+'/records',{data:[f('subject','QA AO NT19T '+key),f('description','QA AO AON19T'+u+' '+key),f('department',DA),f('status','Open'),f('priority','high'),{field:'owner',value:{kind:'null'}}]});const id=r.j?.data?.id;made.tickets.push(id);await sleep(6000);
 const d=(await api('GET','/modules/'+T+'/records/'+id)).j?.data?.data||[];const g=k=>d.find(x=>x.field===k)?.value?.value;return {id,num:g('ticket_number')||g('number'),team:g('team')===TEAM?'TeamA':g('team'),owner:g('owner')||null,at:new Date().toISOString().slice(11,19)};};
try{
 R.s1=(await api('PUT','/desk/assignment/notification-settings',{...orig,direct_rules_enabled:true,notify_team_on_assignment:false})).s;
 const r=await api('POST','/desk/assignment-rules',{type:'direct',name:'QA AO NT19 team '+u,description:'QA',is_active:true,execute_on:['create'],targets:[{criteria:{conditions:[{field_key:'description',operator:'contains',value:'AON19T'+u}],pattern:null},coming_to_department_id:DA,move_to_department_id:null,assign:{kind:'team',user_id:null,team_id:TEAM}}]});
 R.rule=r.s;if(r.j?.data?.id)made.rules.push(r.j.data.id);await sleep(3000);
 R.off=await tk('off');
 R.s2=(await api('PUT','/desk/assignment/notification-settings',{...orig,direct_rules_enabled:true,notify_team_on_assignment:true})).s;await sleep(3000);
 R.on=await tk('on');
}finally{
 R.restore=(await api('PUT','/desk/assignment/notification-settings',orig)).s;R.after=(await api('GET','/desk/assignment/notification-settings')).j?.data;
 for(const id of made.rules)R['delRule']=(await api('DELETE','/desk/assignment-rules/'+id)).s;
 fs.writeFileSync('../nt19t.json',JSON.stringify({u,made,off:R.off,on:R.on}));
 fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+' NT-19 team: direct switch on + team notice off/on for the test, restored '+R.restore+'; rule deleted; tickets '+made.tickets.join(',')+' (delete after bell check).\n');}
return R;
