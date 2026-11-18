var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/as/";eval(fs.readFileSync(__AS+'lib.js','utf8'));
// Re-measure the count the rule uses for A1 and A3 in QA AO Dept B (hidden extra over visible Open tickets) - persistence check.
const AOB='4853562a-0b4d-45cb-ba34-9f2118fcd32c';NM[AOB]='AO-B';const R={at:new Date().toISOString(),steps:[]};const S=(...a)=>{const l=a.join(' ');R.steps.push(l);log(l);};
const all=async()=>{const rows=[];for(let p=1;p<20;p++){const g=await api('GET','/modules/'+T+'/records?page='+p+'&per_page=100');const L=g.j?.data?.items||g.j?.data||[];for(const r of L){const o={};for(const x of r.data||[])o[x.field]=x.value?.value;rows.push(o);}if(!g.j?.meta?.more_records)break;}return rows;};
const K='R19AS6'+U;const PB=await prefs(AOB);let rids=[];
const P=o=>setPrefs({...PB,assign_to_offline_agents:true,department_threshold_enabled:true,agent_threshold_enabled:false,assign_backlogs:false,assign_on_closure:false,...o},AOB);
try{
 for(const [u,n] of [[A1,'A1'],[A3,'A3']]){
  const r=await rule('round_robin','t6 '+n,[rrT(K+n,'sequential',[u])],{dept:AOB});rids.push(r.j?.data?.id);
  const rows=(await all()).filter(x=>x.owner===u&&x.department===AOB&&x.status!=='Closed');const o=rows.filter(x=>x.status==='Open').length;S(n,'not-closed in AO-B:',JSON.stringify(rows.map(x=>[x.ticket_number,x.status])));
  for(let k=1;k<=4;k++){await P({department_threshold:o+k});await sleep(2500);const t=await tk(K+n+' +'+k,{},AOB);const w=await waitOwn(t,18);const tn=(await rec(t)).ticket_number;await patch(t,{status:'Closed'});await sleep(2500);S(n,'Open',o,'thr',o+k,'#'+tn,'->',w);if(w!=='none'){R[n]=k-1;break;}}
  await setA(rids[rids.length-1],false);
 }
}finally{for(const id of rids)if(id)await setA(id,false);R.same=E(await setPrefs(PB,AOB))+' '+(JSON.stringify(await prefs(AOB))===JSON.stringify(PB));LED('t6: QA AO Dept B prefs changed and restored '+R.same);}
save('t6.json',R);return R;
