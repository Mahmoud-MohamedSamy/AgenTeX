var __B="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/bg/";eval(fs.readFileSync(__B+'blib.js','utf8'));
const R={at:new Date().toISOString(),steps:[]};const S=(...a)=>{const l=a.join(' ');R.steps.push(l);log(l);};
const K='BUGD1C'+U;const PB=await prefs(AOB);save('d1c-prefs-orig.json',PB);let rid;
const P=o=>setPrefs({...PB,assign_to_offline_agents:true,department_threshold_enabled:true,agent_threshold_enabled:false,assign_backlogs:false,assign_on_closure:false,...o},AOB);
const openA3=async()=>(await allRows()).filter(r=>r.owner===A3&&r.department===AOB&&r.status==='Open').length;
const measure=async(tag)=>{const o=await openA3();for(let k=1;k<=4;k++){await P({department_threshold:o+k});await sleep(2500);const t=await tk(K+' '+tag+' thr'+(o+k),{},AOB);const w=await waitOwn(t,20);const n=(await rec(t)).ticket_number;await patch(t,{status:'Closed'});await sleep(2500);S(tag,'real Open',o,'thr',o+k,'#'+n,'->',w);if(w!=='none')return {open:o,used:o+k-1,phantom:k-1};}return {open:o,used:'>'+(o+3)};};
try{
 const r=await rule('round_robin','D1C DevTeam2',[rrT(K,'sequential',[A3])],{dept:AOB});rid=r.j?.data?.id;
 R.before=await measure('before');
 await P({department_threshold:50});await sleep(2500);
 const res=await api('POST','/modules/'+T+'/records',{data:fields({subject:PFX+' '+K+' delete at once',description:PFX+' D1 delete right after create',department:AOB,status:'Open',priority:'high',owner:null})});const id=res.j?.data?.id;LED('ticket created '+id+' "'+PFX+' '+K+' delete at once"');
 const d=await api('DELETE','/modules/'+T+'/records/'+id);LED('ticket '+id+' deleted right after create (D1 phantom check) -> '+d.s);S('created + deleted at once',res.s,d.s,new Date().toISOString().slice(11,19));R.delId=id;
 await sleep(60000);
 R.wl=await wl(A3,AOB);S('workload API open_tickets A3 in AO-B',R.wl.dept);
 R.after=await measure('after');
}finally{if(rid)await setA(rid,false);R.same=E(await setPrefs(PB,AOB))+' '+(JSON.stringify(await prefs(AOB))===JSON.stringify(PB));LED('D1C: QA AO Dept B RR prefs changed and restored '+R.same+'; probes closed; rule inactive');}
save('d1c.json',R);return {b:R.before,a:R.after,s:R.same};
