const R={};
const t=await api('PATCH','/desk/teams/'+I.team,{sources:[]});R.team=E(t);if(t.s>=300){const t2=await api('PUT','/desk/teams/'+I.team,{name:'QA RT19 NTF Team',department_id:D,sources:[]});R.teamPut=E(t2);}
const p=await api('PUT','/desk/departments/'+D+'/agents',{agent_user_ids:[O]});R.agents=E(p);const g=(await api('GET','/desk/departments/'+D)).j?.data;R.agentsNow=(g?.agent_user_ids||[]).map(nm);
LED('QA RT19 NTF Dept: agents Test User 1, Dev Team 2, Mahmoud Samy removed ('+R.agents+'), owner kept for the NDC-3000 user step; team QA RT19 NTF Team members cleared ('+(R.teamPut||R.team)+')');
const bp=(await api('GET','/modules/'+TK+'/blueprints/'+I.bp3061)).j?.data;R.bpActive=bp?.isActive;
const h=(await api('GET','/desk/happiness/settings')).j.data;R.happ='on='+h.is_enabled+' scoped='+h.department_scope_enabled+' n='+h.department_ids.length;
R.rule2864=Ls((await api('GET','/desk/notification-rules/departments/'+D)).j?.data).filter(x=>x.category!=='cc'&&(x.is_customized||x.template_id)).map(x=>x.key+' en='+x.is_enabled+' tpl='+x.template_id);
R.locks=fs.readdirSync(RUN+'/locks');
return R;
