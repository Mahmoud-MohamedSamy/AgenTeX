// D-13: rule → A3; A3 removed from QA AS6 Dept A (PUT /desk/departments/{id}/agents) → rule shows ineligible, never assigns A3; team RR skips A3. Restores A3 and switches.
eval(fs.readFileSync('lib-as.js','utf8'));const R={};const orig=await notif();const k='AOD13'+U;
const d0=(await api('GET','/desk/departments/'+DA)).j.data;const ag0=d0.agent_user_ids;R.a3Member=ag0.includes(A3);
try{await api('PUT','/desk/assignment/notification-settings',{...orig,direct_rules_enabled:true});
 const dr=await rule('direct','D13',[daT(k+'d',ag(A3))]);const rr=await rule('round_robin','D13rr',[{criteria:crit(k+'t'),method:'sequential',pool:{kind:'team',user_ids:[],team_id:TEAM,excluded_user_ids:[]}}]);
 const rm=await api('PUT','/desk/departments/'+DA+'/agents',{agent_user_ids:ag0.filter(x=>x!==A3)});R.remove=E(rm);await sleep(5000);
 R.a3MemberAfter=(await api('GET','/desk/departments/'+DA)).j.data.agent_user_ids.includes(A3);
 const g=await getRule(dr.j.data.id);R.ruleShows=JSON.stringify({ineligible:g?.targets?.[0]?.ineligible,unknown:g?.targets?.[0]?.unknown_user_ids});
 const t1=await tk(k+'d');R.directOwner=await waitOwn(t1,14);const tt=[];for(let i=1;i<=3;i++){tt.push(await waitOwn(await tk(k+'t '+i),14));}R.teamRR=tt.join(',');
 await setA(dr.j.data.id,false);await setA(rr.j.data.id,false);
}finally{R.restore=E(await api('PUT','/desk/departments/'+DA+'/agents',{agent_user_ids:ag0}));R.a3Back=(await api('GET','/desk/departments/'+DA)).j.data.agent_user_ids.includes(A3);
 R.switchRestore=(await api('PUT','/desk/assignment/notification-settings',orig)).s;R.directAfter=(await notif()).direct_rules_enabled;}
return R;
