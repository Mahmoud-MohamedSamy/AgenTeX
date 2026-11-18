var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/as/";
// Why did A1 (4 open in QA AO Dept B per workload) get 0 of 20 at threshold 5? List A1's tickets in AO-B (from ledger ids) and probe the threshold the rule really applies (pool A1 only).
eval(fs.readFileSync(__AS+'lib.js','utf8'));
const AOB='4853562a-0b4d-45cb-ba34-9f2118fcd32c';NM[AOB]='AO-B';const R={steps:[]};const S=(...a)=>R.steps.push(a.join(' '));
const led=fs.readFileSync(RUN+'/ledger.md','utf8');const ids=[...new Set([...(led.match(/AS lane: ticket created ([0-9a-f-]{36})/g)||[]).map(x=>x.slice(-36)),...made.tickets.filter(x=>typeof x==='string')])];
made.tickets=[...new Set([...made.tickets.filter(x=>typeof x==='string'),...ids])];saveMade();
const a1=[];for(const id of ids){const o=await rec(id);if(o.department===AOB&&o.owner===A1)a1.push([o.ticket_number,o.status,String(o.subject).slice(11,50)]);}
R.a1inAOB=a1;R.wl=await wl(A1,AOB);
const PB=await prefs(AOB);let rid;
try{
 const K='R19ASCNT'+U;const r=await rule('round_robin','count probe A1',[rrT(K,'sequential',[A1])],{dept:AOB});rid=r.j?.data?.id;
 for(const n of (process.env.NS||'5,6,7,8').split(',').map(Number)){
  S('thr',n,E(await setPrefs({...PB,assign_to_offline_agents:true,department_threshold_enabled:true,department_threshold:n,agent_threshold_enabled:false,assign_backlogs:false,assign_on_closure:false},AOB)));await sleep(2500);
  const t=await tk(K+' thr'+n,{},AOB);const o=await waitOwn(t,16);S('threshold '+n+' (workload open '+(await wl(A1,AOB)).dept+') ->',o);
  if(o!=='none'){await patch(t,{status:'Closed'});await sleep(3000);break;}else{await patch(t,{status:'Closed'});}
 }
}finally{if(rid)await setA(rid,false);R.restore=E(await setPrefs(PB,AOB));R.same=JSON.stringify(await prefs(AOB))===JSON.stringify(PB);LED('QA AO Dept B prefs changed for count probe and restored '+R.same);}
save('tcount.json',R);return R;
