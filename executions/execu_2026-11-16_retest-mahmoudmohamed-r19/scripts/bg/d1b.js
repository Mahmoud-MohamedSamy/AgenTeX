var __B="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/bg/";eval(fs.readFileSync(__B+'blib.js','utf8'));
const R={at:new Date().toISOString(),steps:[],agents:{}};const S=(...a)=>{const l=a.join(' ');R.steps.push(l);log(l);};
const K='BUGD1'+U;const PB=await prefs(AOB);save('d1-prefs-orig.json',PB);let rids=[];
const P=o=>setPrefs({...PB,assign_to_offline_agents:true,department_threshold_enabled:true,agent_threshold_enabled:false,assign_backlogs:false,assign_on_closure:false,...o},AOB);
try{
 for(const [u,n] of [[A1,'TestUser1']]){
  const r=await rule('round_robin','D1 '+n,[rrT(K+n,'sequential',[u])],{dept:AOB});rids.push(r.j?.data?.id);
  const rows=(await allRows()).filter(x=>x.owner===u&&x.department===AOB);
  const open=rows.filter(x=>x.status==='Open'),hold=rows.filter(x=>x.status==='On Hold'),esc=rows.filter(x=>x.status==='Escalated'),oth=rows.filter(x=>!['Open','On Hold','Escalated','Closed'].includes(x.status));
  const w=await wl(u,AOB);S('wl',JSON.stringify(w));const A={recordsOpen:open.length,openNums:open.map(x=>x.ticket_number),onHold:hold.length,escalated:esc.length,other:oth.map(x=>[x.ticket_number,x.status]),workloadOpen:w.dept,probes:[]};R.agents[n]=A;
  S(n,'records Open',open.length,JSON.stringify(A.openNums),'OnHold',hold.length,'Esc',esc.length,'other',JSON.stringify(A.other),'| workload API open_tickets',w.dept);
  const o=open.length+esc.length;
  for(let k=1;k<=4;k++){await P({department_threshold:o+k});await sleep(2500);const t=await tk(K+n+' thr'+(o+k),{},AOB);if(t&&t.err){S('CREATE ERROR',t.err);A.probes.push(['thr '+(o+k),'create error',t.err.slice(0,200)]);k--;await sleep(3000);if(A.probes.length>8)break;continue;}const ow=await waitOwn(t,20);const tn=(await rec(t)).ticket_number;await patch(t,{status:'Closed'});await sleep(2500);A.probes.push(['thr '+(o+k),'#'+tn,ow]);S(n,'dept thr',o+k,'#'+tn,'->',ow);if(ow!=='none'){A.countUsed=o+k-1;A.phantom=o+k-1-o;break;}}
  await setA(rids[rids.length-1],false);
 }
}finally{for(const id of rids)if(id)await setA(id,false);R.same=E(await setPrefs(PB,AOB))+' '+(JSON.stringify(await prefs(AOB))===JSON.stringify(PB));LED('D1: QA AO Dept B RR prefs changed and restored '+R.same+'; probe tickets closed; D1 rules inactive');}
R.wlraw=(await api('GET','/desk/agents/'+A1+'/workload')).t.slice(0,1500);save('d1b.json',R);return R;
