// Direct assignment regression (D-01..D-11) in QA AS6 Dept A. User OK 10 Nov: tenant direct switch on for the test, back off after (finally).
const DA='b3cd7c28-7879-42b1-b7a9-06bc9bf64aa6',DB='ce1d8a43-07df-4b37-891c-cc8b2eceec6f',T='88e8ea44-1658-4df3-9930-d0902b91073d',TEAM='434140a3-2145-428c-9e57-e6bc5cf2f8d0';
const A1='876ce871-2b02-4854-89a7-68050391c62b',A2='d23fb4e0-248d-41f6-af60-d28885a7007e',A3='5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4';const N={[A1]:'A1',[A2]:'A2',[A3]:'A3',[TEAM]:'TeamA',[DA]:'AS6-A',[DB]:'AS6-B'};
const u=Math.random().toString(36).slice(2,6);const R={u};const made={rules:[],tickets:[]};const f=(k,v)=>({field:k,value:{kind:'string',value:v}});
const orig=(await api('GET','/desk/assignment/notification-settings')).j?.data;R.switchBefore=orig.direct_rules_enabled;
const rule=async(name,key,tgt,ex=['create'],extra=[])=>{const conds=[{field_key:'description',operator:'contains',value:key},...extra];const r=await api('POST','/desk/assignment-rules',{type:'direct',name:'QA AO '+name+' '+u,description:'QA',is_active:true,execute_on:ex,targets:[{criteria:{conditions:conds,pattern:conds.length>1?'1 and 2':null},coming_to_department_id:tgt.coming===undefined?DA:tgt.coming,move_to_department_id:tgt.move||null,assign:tgt.assign}]});if(r.j?.data?.id)made.rules.push(r.j.data.id);return r.s+(r.s>=300?' '+r.t.slice(0,200):'');};
const tk=async(key,extra=[])=>{const r=await api('POST','/modules/'+T+'/records',{data:[f('subject','QA AO '+key),f('description','QA AO '+key),f('department',DA),f('status','Open'),f('priority','high'),{field:'owner',value:{kind:'null'}},...extra]});const id=r.j?.data?.id;made.tickets.push(id);await sleep(4000);return id;};
const st=async id=>{const d=(await api('GET','/modules/'+T+'/records/'+id)).j?.data?.data||[];const g=k=>{const v=d.find(x=>x.field===k)?.value?.value;return N[v]||(v?String(v).slice(0,8):'none');};return 'owner='+g('owner')+' team='+g('team')+' dept='+g('department');};
try{
 R.switchOn=(await api('PUT','/desk/assignment/notification-settings',{...orig,direct_rules_enabled:true})).s;
 const K=x=>'AOD'+x+u;
 R.rules={D01:await rule('D01 A1',K('01'),{assign:{kind:'agent',user_id:A1,team_id:null}}),
  D05:await rule('D05 team',K('05'),{assign:{kind:'team',user_id:null,team_id:TEAM}}),
  D06:await rule('D06 move',K('06'),{coming:null,move:DB,assign:{kind:'agent',user_id:A1,team_id:null}}),
  D08a:await rule('D08 unassigned',K('08'),{assign:{kind:'unassigned',user_id:null,team_id:null}}),
  D08b:await rule('D08 A2',K('08'),{assign:{kind:'agent',user_id:A2,team_id:null}}),
  D09:await rule('D09 update',K('09'),{assign:{kind:'agent',user_id:A1,team_id:null}},['update'],[{field_key:'priority',operator:'equals',value:'low'}]),
  D11a:await rule('D11 A1',K('11'),{assign:{kind:'agent',user_id:A1,team_id:null}}),
  D11b:await rule('D11 A2',K('11'),{assign:{kind:'agent',user_id:A2,team_id:null}})};
 R['D-01 create → A1']=await st(await tk(K('01')));
 R['D-02 no match → none']=await st(await tk('AODnomatch'+u));
 R['D-03 preset owner A3 kept']=await st(await tk(K('01')+' preset',[{field:'owner',value:{kind:'string',value:A3}}]));
 R['D-05 team → TeamA, no owner']=await st(await tk(K('05')));
 R['D-06 any dept → moved to AS6-B, A1']=await st(await tk(K('06')));
 R['D-08 unassigned stops next rule → none']=await st(await tk(K('08')));
 const t9=await tk(K('09'));R['D-09 before update']=await st(t9);
 await api('PATCH','/modules/'+T+'/records/'+t9,{data:[f('priority','low')]});await sleep(4000);R['D-09 after update low → A1']=await st(t9);
 await api('POST','/desk/tickets/'+t9+'/assign',{owner_id:A3,team_id:null});await sleep(2000);await api('PATCH','/modules/'+T+'/records/'+t9,{data:[f('status','On Hold')]});await sleep(4000);R['D-10 owned ticket, 2nd update → A3 kept']=await st(t9);
 R['D-11 first rule wins → A1']=await st(await tk(K('11')));
 const fd=(await api('GET','/desk/tickets/'+made.tickets[0]+'/activity')).t.match(/"action":"ticket\.auto_assigned"[^}]*\}[^}]{0,300}/);R.historyD01=fd?fd[0].slice(0,400):null;
}catch(e){R.error=e.message;}
finally{R.switchRestore=(await api('PUT','/desk/assignment/notification-settings',orig)).s;R.switchAfter=(await api('GET','/desk/assignment/notification-settings')).j?.data?.direct_rules_enabled;}
R.cleanup={};for(const id of made.rules)R.cleanup['r'+(await api('DELETE','/desk/assignment-rules/'+id)).s]=(R.cleanup['r'+204]||0)+1;
for(const id of made.tickets.filter(Boolean)){const s=(await api('DELETE','/modules/'+T+'/records/'+id)).s;R.cleanup['t'+s]=(R.cleanup['t'+s]||0)+1;}
return R;
