var __B="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/bg/";eval(fs.readFileSync(__B+'blib.js','utf8'));
const R={at:new Date().toISOString(),steps:[]};const S=(...a)=>{const l=a.join(' ');R.steps.push(l);log(l);};
const K='BUGD2'+U;const PB=await prefs(AOB);save('d2-prefs-orig.json',PB);let rid;
try{
 const r=await rule('round_robin','D2 burst DevTeam2',[rrT(K,'sequential',[A3])],{dept:AOB});rid=r.j?.data?.id;
 S('prefs',E(await setPrefs({...PB,assign_to_offline_agents:true,department_threshold_enabled:true,department_threshold:3,agent_threshold_enabled:false,assign_backlogs:false,assign_on_closure:false},AOB)));await sleep(2500);
 const t0=Date.now();const res=await Promise.all([...Array(10)].map((_,i)=>api('POST','/modules/'+T+'/records',{data:fields({subject:PFX+' '+K+' burst '+(i+1),description:PFX+' D2 parallel burst',department:AOB,status:'Open',priority:'high',owner:null})})));
 S('10 parallel creates in',Date.now()-t0,'ms; statuses',res.map(x=>x.s).join(','));
 const ids=res.map(x=>x.j?.data?.id);for(const [i,id] of ids.entries()){if(id){made.tickets.push(id);LED('ticket created '+id+' "'+PFX+' '+K+' burst '+(i+1)+'" (D2 parallel burst)');}else S('create',i+1,'failed',res[i].s,res[i].t.slice(0,300));}saveMade();
 await sleep(20000);
 R.rows=[];for(const [i,id] of ids.entries()){if(!id)continue;const raw=await recRaw(id);const d={};for(const x of raw.data||[])d[x.field]=x.value?.value;const f=(await api('GET','/desk/tickets/'+id+'/activity')).j?.data;R.rows.push([i+1,d.ticket_number||'NONE',nm(d.owner),Array.isArray(f)?f.length:'?']);}
 S('after 20 s (records API: number, owner, activity count):',JSON.stringify(R.rows));
 R.ghosts=R.rows.filter(x=>x[1]==='NONE').length;S('records with no ticket number:',R.ghosts);
 for(const id of ids)if(id)await patch(id,{status:'Closed'});
}finally{if(rid)await setA(rid,false);R.same=E(await setPrefs(PB,AOB))+' '+(JSON.stringify(await prefs(AOB))===JSON.stringify(PB));LED('D2: QA AO Dept B RR prefs changed and restored '+R.same+'; burst tickets closed; D2 rule inactive');}
save('d2burst.json',R);return R;
