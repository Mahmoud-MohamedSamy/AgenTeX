var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/as/";eval(fs.readFileSync(__AS+'lib.js','utf8'));
// Clean threshold count check, one variable at a time, QA AO Dept B, pool = one agent, sequential, offline allowed.
const AOB='4853562a-0b4d-45cb-ba34-9f2118fcd32c';NM[AOB]='AO-B';const R={steps:[]};const S=(...a)=>{const l=a.join(' ');R.steps.push(l);log(l);};
const PB=await prefs(AOB);save('t3-prefs-orig.json',PB);const rules=[];const extra=[];
const num=async id=>(await rec(id)).ticket_number;
const P=(o)=>setPrefs({...PB,assign_to_offline_agents:true,department_threshold_enabled:false,agent_threshold_enabled:false,assign_backlogs:false,assign_on_closure:false,...o},AOB);
const K='R19AS3'+U;
const probe=async(label,who)=>{await sleep(2500);const t=await tk(K+' '+label,{},AOB);const o=await waitOwn(t,18);const n=await num(t);await patch(t,{status:'Closed'});await sleep(2500);return '#'+n+' -> '+o;};
const vis=async u=>{const w=await wl(u,AOB);return 'workload AO-B '+w.dept+', all depts '+w.all;};
try{
 for(const [u,nmU] of [[A3,'A3'],[A1,'A1']]){
  const r=await rule('round_robin','t3 count '+nmU,[rrT(K+nmU,'sequential',[u])],{dept:AOB});rules.push(r.j?.data?.id);S('rule',nmU,E(r));
  const pr=async(l)=>{await sleep(2500);const t=await tk(K+nmU+' '+l,{},AOB);const o=await waitOwn(t,18);const n=await num(t);await patch(t,{status:'Closed'});await sleep(2500);return '#'+n+' -> '+o;};
  const v=(await wl(u,AOB)).dept;S(nmU,'start',await vis(u));await P({department_threshold_enabled:true,department_threshold:v});
  S(nmU,'dept thr',v,'(= visible open) ->',await pr('thr'+v));
  await P({department_threshold_enabled:true,department_threshold:v+1});
  S(nmU,'dept thr',v+1,'(= visible+1) ->',await pr('thr'+(v+1)));
  if(nmU==='A3'){
   // var 1: +1 Open ticket for A3 in OTHER dept (QA AS6 Dept A)
   const o1=await tk('t3 A3 open other dept',{owner:A3},DA);extra.push(o1);await sleep(2500);S('var1 added Open A3 ticket in AS6 Dept A #'+(await num(o1)),await vis(u));
   S('A3 dept thr',v+1,'after other-dept ticket ->',await pr('v1thr'+(v+1)),'(expect A3)');
   // var 2: +1 Open ticket for A3 in AO-B
   const o2=await tk('t3 A3 open AOB',{owner:A3},AOB);extra.push(o2);await sleep(2500);S('var2 added Open A3 ticket in AO-B #'+(await num(o2)),await vis(u));
   S('A3 dept thr',v+1,'after same-dept Open ticket ->',await pr('v2thr'+(v+1)),'(expect none)');
   // var 3: that ticket On Hold
   S('var3 set it On Hold',E(await patch(o2,{status:'On Hold'})));await sleep(2500);S(await vis(u));
   S('A3 dept thr',v+1,'after On Hold ->',await pr('v3thr'+(v+1)),'(expect A3)');
   // var 4: Escalated (info)
   S('var4 set it Escalated',E(await patch(o2,{status:'Escalated'})));await sleep(2500);S(await vis(u));
   S('A3 dept thr',v+1,'with it Escalated ->',await pr('v4thr'+(v+1)),'(info)');
   S('back to On Hold',E(await patch(o2,{status:'On Hold'})));
   // var 5: agent-level threshold (dept thr off)
   const v2=(await wl(u,AOB)).dept;
   const ag1=await P({agent_threshold_enabled:true,agent_thresholds:[{user_id:A3,threshold:v2}]});S('agent thr A3',v2,E(ag1));
   S('A3 agent thr',v2,'(= visible) ->',await pr('agthr'+v2),'(expect none; On Hold + other dept not counted)');
   await P({agent_threshold_enabled:true,agent_thresholds:[{user_id:A3,threshold:v2+1}]});
   S('A3 agent thr',v2+1,'->',await pr('agthr'+(v2+1)),'(expect A3)');
   await P({});
  }
 }
}finally{for(const id of rules)if(id)await setA(id,false);for(const id of extra){await patch(id,{status:'Closed'});}R.restore=E(await setPrefs(PB,AOB));R.same=JSON.stringify(await prefs(AOB))===JSON.stringify(PB);LED('QA AO Dept B prefs changed for t3 count check and restored '+R.same+'; extra tickets closed');}
save('t3.json',R);return R;
