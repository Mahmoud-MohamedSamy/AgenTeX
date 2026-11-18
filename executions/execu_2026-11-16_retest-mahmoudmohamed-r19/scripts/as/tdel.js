var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/as/";
// Hypothesis: threshold count includes deleted (Recycle Bin) tickets. A1 counted 6 in AO-B with 4 Open. Create 1 Open ticket owner A1 in AO-B, delete it, re-probe (expect still 6 if deleted tickets are not counted).
eval(fs.readFileSync(__AS+'lib.js','utf8'));
const AOB='4853562a-0b4d-45cb-ba34-9f2118fcd32c';NM[AOB]='AO-B';const R={steps:[]};const S=(...a)=>R.steps.push(a.join(' '));
const PB=await prefs(AOB);let rid;
const probe=async(n,K)=>{await setPrefs({...PB,assign_to_offline_agents:true,department_threshold_enabled:true,department_threshold:n,agent_threshold_enabled:false,assign_backlogs:false,assign_on_closure:false},AOB);await sleep(2500);
 const t=await tk(K+' thr'+n,{},AOB);const o=await waitOwn(t,16);await patch(t,{status:'Closed'});await sleep(2000);return o;};
try{
 const K='R19ASDEL'+U;const r=await rule('round_robin','delete probe A1',[rrT(K,'sequential',[A1])],{dept:AOB});rid=r.j?.data?.id;
 S('before: thr 7 ->',await probe(7,K));
 const d=await tk('DEL probe A1 open',{owner:A1},AOB);await sleep(2000);S('created Open A1 ticket; workload',(await wl(A1,AOB)).dept);
 S('with it: thr 7 ->',await probe(7,K),'(expect none: 5 open + 2 unexplained = 7)');
 const del=await api('DELETE','/modules/'+T+'/records/'+d);LED('ticket '+d+' deleted (to Recycle Bin) for threshold count probe -> '+del.s);S('deleted',del.s);await sleep(3000);
 S('after delete: workload',(await wl(A1,AOB)).dept);
 S('after delete: thr 7 ->',await probe(7,K),'(A1 = assigned means deleted not counted)');
 S('after delete: thr 8 ->',await probe(8,K));
}finally{if(rid)await setA(rid,false);R.restore=E(await setPrefs(PB,AOB));R.same=JSON.stringify(await prefs(AOB))===JSON.stringify(PB);LED('QA AO Dept B prefs changed for delete probe and restored '+R.same);}
save('tdel.json',R);return R;
