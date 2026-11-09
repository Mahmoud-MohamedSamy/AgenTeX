// NDC-2812 part 2: move into a Team-Assignment-off department with a team; team delete with reassign; agent work reassign.
eval(require('fs').readFileSync('lib.js','utf8'));
const NM={};NM[IDS.A1]='A1';NM[IDS.A2]='A2';NM[IDS.A3]='A3';NM[IDS.O]='O';NM[IDS.TA]='Team A';const T2='8d2b7e89-1758-4abb-9595-88fbe52d1679';NM[T2]='Team 2';const nm=x=>x?(NM[x]||String(x).slice(0,8)):'-';
const ow=async id=>{const x=await own(id);return {owner:nm(x.owner),team:nm(x.team),dept:x.dept===IDS.DA?'Dept A':x.dept===IDS.DB?'Dept B':x.dept};};
const g=(await api('GET','/desk/departments/'+IDS.DA+'/team-assignment')).j.data;const o={};
const tMv=await mkTicket('QA RT14 2812 move B to A',IDS.DB,{},'NDC-2812');const tMv2=await mkTicket('QA RT14 2812 move B to A agent',IDS.DB,{},'NDC-2812');
const tT2=await mkTicket('QA RT14 2812 team 2 work',IDS.DA,{},'NDC-2812');o.t2assign=sh(await api('POST','/desk/tickets/'+tT2.id+'/assign',{owner_id:null,team_id:T2})).s;o.t2before=await ow(tT2.id);
o.teamWorkload=(await api('GET','/desk/teams/'+T2+'/workload')).t.slice(0,300);
const wl=await api('GET','/desk/agents/'+IDS.A1+'/workload');const busy=(wl.j?.data?.departments||[]).filter(d=>d.open_tickets||d.open_activities);
try{
 o.off=sh(await api('PUT','/desk/departments/'+IDS.DA+'/team-assignment',{...g,enabled:false})).s;LED('NDC-2812 part 2: Dept A team assignment OFF temporarily');
 o['5 move B->A with team (off)']=sh(await api('POST','/desk/tickets/'+tMv.id+'/move',{department_id:IDS.DA,team_id:IDS.TA,owner_id:null}));o['5 after']=await ow(tMv.id);
 o['5c move B->A with agent (off)']=sh(await api('POST','/desk/tickets/'+tMv2.id+'/move',{department_id:IDS.DA,owner_id:IDS.A2,team_id:null}));o['5c after']=await ow(tMv2.id);
 o['8 delete Team 2, reassign its tickets to Team A (off)']=sh(await api('DELETE','/desk/teams/'+T2+'?reassign_team_id='+IDS.TA));o['8 after']=await ow(tT2.id);o['8 Team 2 now']=(await api('GET','/desk/teams/'+T2)).s;
 if(busy.length&&busy.every(d=>d.department_id===IDS.DA||d.department_id===IDS.DB)){
  o['7 agent reassign (A1 Dept A work -> Team A, off)']=sh(await api('POST','/desk/agents/'+IDS.A1+'/reassign',{departments:[{department_id:IDS.DA,target:{kind:'team',team_id:IDS.TA}}],update_rules:false}));
  if(o['7 agent reassign (A1 Dept A work -> Team A, off)'].s===400)o['7b alt shape']=sh(await api('POST','/desk/agents/'+IDS.A1+'/reassign',{departments:[{department_id:IDS.DA,target:{kind:'team',id:IDS.TA}}],update_rules:false}));
  const w2=await api('GET','/desk/agents/'+IDS.A1+'/workload');o['7 A1 Dept A open after']=(w2.j?.data?.departments||[]).filter(d=>d.department_id===IDS.DA).map(d=>d.open_tickets+' tickets / '+d.open_activities+' activities');
 } else o['7']='skipped: busy outside QA: '+busy.map(d=>d.department_name).join(',');
}finally{o.on=sh(await api('PUT','/desk/departments/'+IDS.DA+'/team-assignment',{...g,enabled:true})).s;LED('NDC-2812 part 2: Dept A team assignment restored ON');o.onRead=(await api('GET','/desk/departments/'+IDS.DA+'/team-assignment')).j.data.enabled;}
o['12 move B->A with team (on)']=sh(await api('POST','/desk/tickets/'+tMv.id+'/move',{department_id:IDS.DA,team_id:IDS.TA,owner_id:null}));o['12 after']=await ow(tMv.id);
fs.writeFileSync(RUN+'/out/t2812b.json',JSON.stringify(o,null,1));return o;
