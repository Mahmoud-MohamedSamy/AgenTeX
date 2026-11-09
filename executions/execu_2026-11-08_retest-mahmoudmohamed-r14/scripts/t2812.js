// NDC-2812 retest 8 Nov: Team Assignment off -> team assignment refused (422 team_assignment_off) everywhere; agent OK; on -> team OK.
eval(require('fs').readFileSync('lib.js','utf8'));
const NM={};NM[IDS.A1]='A1';NM[IDS.A2]='A2';NM[IDS.A3]='A3';NM[IDS.O]='O';NM[IDS.TA]='Team A';const nm=x=>x?(NM[x]||String(x).slice(0,8)):'-';
const ow=async id=>{const x=await own(id);return {owner:nm(x.owner),team:nm(x.team),dept:x.dept===IDS.DA?'Dept A':x.dept===IDS.DB?'Dept B':x.dept};};
const g=(await api('GET','/desk/departments/'+IDS.DA+'/team-assignment')).j.data;const o={shape:g};
let teamB=null;
try{
 // QA team 2 in Dept A (for the team-delete reassign tool), created while Team Assignment is on
 const tc=await api('POST','/desk/teams',{name:'QA RT14 2812 team 2',description:'QA retest NDC-2812 8 Nov - safe to delete',department_id:IDS.DA,sources:[{kind:'agent',ref_id:IDS.A1}]});
 teamB=tc.j?.data?.id||tc.j?.data?.team?.id;o.team2=tc.s+' '+(E(tc)||'');if(teamB)LED('team "QA RT14 2812 team 2" '+teamB);
 const tDel=await mkTicket('QA RT14 2812 on team 2',IDS.DA,{},'NDC-2812');o.onTeam2=sh(await api('POST','/desk/tickets/'+tDel.id+'/assign',{owner_id:null,team_id:teamB})).s;
 const tMv=await mkTicket('QA RT14 2812 move from B',IDS.DB,{},'NDC-2812');
 const tA1=await mkTicket('QA RT14 2812 for agent A1',IDS.DA,{},'NDC-2812');await api('POST','/desk/tickets/'+tA1.id+'/assign',{owner_id:IDS.A1,team_id:null});
 // OFF
 o.off=sh(await api('PUT','/desk/departments/'+IDS.DA+'/team-assignment',{...g,enabled:false})).s;LED('NDC-2812: Dept A team assignment OFF temporarily');
 o.offRead=(await api('GET','/desk/departments/'+IDS.DA+'/team-assignment')).j.data.enabled;
 const t1=await mkTicket('QA RT14 2812 off team',IDS.DA,{},'NDC-2812');
 o['1 assign team (off)']=sh(await api('POST','/desk/tickets/'+t1.id+'/assign',{owner_id:null,team_id:IDS.TA}));o['1 after']=await ow(t1.id);
 o['2 assign agent (off)']=sh(await api('POST','/desk/tickets/'+t1.id+'/assign',{owner_id:IDS.A2,team_id:null}));o['2 after']=await ow(t1.id);
 o['3 assign agent+team (off)']=sh(await api('POST','/desk/tickets/'+t1.id+'/assign',{owner_id:IDS.A2,team_id:IDS.TA}));o['3 after']=await ow(t1.id);
 o['4 record PATCH team (off)']=sh(await patchT(t1.id,{team:IDS.TA}));o['4 after']=await ow(t1.id);
 o['5 move B->A with team (PATCH)']=sh(await patchT(tMv.id,{department:IDS.DA,team:IDS.TA}));o['5 after']=await ow(tMv.id);
 o['5b move B->A with team (assign+department)']=sh(await api('POST','/desk/tickets/'+tMv.id+'/assign',{owner_id:null,team_id:IDS.TA,department_id:IDS.DA}));o['5b after']=await ow(tMv.id);
 o['6 bulk assign team (off)']=sh(await api('POST','/desk/tickets/bulk/assign',{ticket_ids:[t1.id],owner_id:null,team_id:IDS.TA}));o['6 after']=await ow(t1.id);
 o['6b bulk assign agent (off)']=sh(await api('POST','/desk/tickets/bulk/assign',{ticket_ids:[t1.id],owner_id:IDS.A3,team_id:null}));o['6b after']=await ow(t1.id);
 // agent work reassign: only if A1's open work is all in QA departments
 const wl=await api('GET','/desk/agents/'+IDS.A1+'/workload');const deps=(wl.j?.data?.departments||[]);o.a1workload=deps.map(d=>({dept:d.department_id===IDS.DA?'Dept A':d.department_id===IDS.DB?'Dept B':d.department_name,tickets:d.open_tickets,acts:d.open_activities}));
 if(deps.length&&deps.every(d=>d.department_id===IDS.DA||d.department_id===IDS.DB)){
  const body=tgt=>({departments:deps.map(d=>({department_id:d.department_id,target:d.department_id===IDS.DA?tgt:{kind:'agent',user_id:IDS.A1}})),update_rules:false});
  o['7 agent reassign -> team (off)']=sh(await api('POST','/desk/agents/'+IDS.A1+'/reassign',{departments:[{department_id:IDS.DA,target:{kind:'team',team_id:IDS.TA}}],update_rules:false}));
  if(o['7 agent reassign -> team (off)'].s===400)o['7b agent reassign alt shape']=sh(await api('POST','/desk/agents/'+IDS.A1+'/reassign',{departments:[{department_id:IDS.DA,target:{kind:'team',id:IDS.TA}}],update_rules:false}));
  o['7 after (A1 ticket)']=await ow(tA1.id);
 } else o['7 agent reassign']='skipped: A1 has open work outside QA departments';
 o['8 delete team 2, reassign to Team A (off)']=sh(await api('DELETE','/desk/teams/'+teamB+'?reassign_team_id='+IDS.TA));o['8 after']=await ow(tDel.id);
 o['8 team2 still there']=(await api('GET','/desk/teams/'+teamB)).s;
 // rules with a team target (regression of the earlier correct behaviour)
 o['9 new rule team target (off)']=sh(await api('POST','/desk/assignment-rules',{type:'direct',name:'QA RT14 2812 team rule',is_active:false,execute_on:['create'],targets:[DT('QA RT14 2812 rule',IDS.DA,null,TM(IDS.TA))]}));
 if(o['9 new rule team target (off)'].s===201){const id=JSON.parse(o['9 new rule team target (off)'].d).id;LED('rule direct "QA RT14 2812 team rule" '+id);NEW.R2812=id;}
}finally{
 o.on=sh(await api('PUT','/desk/departments/'+IDS.DA+'/team-assignment',{...g,enabled:true})).s;LED('NDC-2812: Dept A team assignment restored ON');
 o.onRead=(await api('GET','/desk/departments/'+IDS.DA+'/team-assignment')).j.data.enabled;
}
const t2=await mkTicket('QA RT14 2812 on team',IDS.DA,{},'NDC-2812');
o['10 assign team (on)']=sh(await api('POST','/desk/tickets/'+t2.id+'/assign',{owner_id:null,team_id:IDS.TA}));o['10 after']=await ow(t2.id);
o['11 bulk assign team (on)']=sh(await api('POST','/desk/tickets/bulk/assign',{ticket_ids:[t2.id],owner_id:IDS.A1,team_id:IDS.TA}));o['11 after']=await ow(t2.id);
if(teamB){NEW.TEAM2=teamB;}saveIds();
fs.writeFileSync(RUN+'/out/t2812.json',JSON.stringify(o,null,1));return o;
