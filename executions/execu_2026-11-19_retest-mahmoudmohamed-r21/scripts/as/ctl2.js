var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/scripts/as/";eval(fs.readFileSync(__AS+'lib.js','utf8'));
const AOB='4853562a-0b4d-45cb-ba34-9f2118fcd32c';const R={steps:[]};const S=(...a)=>{R.steps.push(a.join(' '));save('ctl2.json',R);};
const PB=await prefs(AOB);const rids=[];
const pres=async()=>{const a=(await api('GET','/desk/queues/agents')).j?.data;const L=Array.isArray(a)?a:(a?.agents||[]);return L.filter(x=>[A1,A3,O].includes(x.user_id)).map(x=>nm(x.user_id)+':'+JSON.stringify(x.presence||x.status||{}).slice(0,120));};
try{
 S('presence',JSON.stringify(await pres()));
 S('prefs',E(await setPrefs({...PB,assign_to_offline_agents:true,department_threshold_enabled:false,agent_threshold_enabled:false,assign_backlogs:false,assign_on_closure:false},AOB)));await sleep(3000);
 for(const [n,u] of [['O',O],['A3',A3]]){const K='R20CT2'+n+U;const r=await rule('round_robin','control '+n,[rrT(K,'sequential',[u])],{dept:AOB});rids.push(r.j?.data?.id);await sleep(4000);
  const t=await tk(K+' control',{},AOB);const x=await waitRR(t,90);S(n,'#'+x.n,'->',x.o,JSON.stringify((await feed(t)).map(e=>e.action.replace('ticket.',''))));await patch(t,{status:'Closed'});await setA(rids[rids.length-1],false);}
}finally{for(const id of rids)await setA(id,false);R.same=E(await setPrefs(PB,AOB))+' '+(JSON.stringify(await prefs(AOB))===JSON.stringify(PB));LED('ctl2: QA AO Dept B RR prefs changed and restored '+R.same);}
return R;
