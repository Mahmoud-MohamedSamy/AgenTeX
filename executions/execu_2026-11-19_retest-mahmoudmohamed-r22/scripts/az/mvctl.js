var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/scripts/az/";eval(fs.readFileSync(__AS+'lib.js','utf8'));
const AOB='4853562a-0b4d-45cb-ba34-9f2118fcd32c';const R={steps:[],t0:new Date().toISOString()};const S=(...a)=>{R.steps.push(a.join(' '));save('mvctl.json',R);};
const PB=await prefs(AOB);save('mvctl-prefs-orig.json',PB);
try{
S('prefs',E(await setPrefs({...PB,assign_to_offline_agents:true,department_threshold_enabled:false,agent_threshold_enabled:false,assign_backlogs:false,assign_on_closure:false},AOB)));
const K='MV'+U;const r=await rule('round_robin','move control owner',[rrT(K,'sequential',[O])],{dept:AOB,on:['create','update']});R.rid=r.j?.data?.id;S('rule',E(r));await sleep(4000);
// A: create directly in AOB (create path)
const a=await tk(K+' create',{},AOB);const xa=await waitRR(a,90);S('create-path #'+xa.n,'->',xa.o);R.a=a;
// B: create in AS6 Dept A, then move into AOB (move path)
const b=await tk(K+' move',{},DA);const xb=await waitDesk(b);await sleep(3000);const m=await api('POST','/desk/tickets/'+b+'/move',{department_id:AOB,team_id:null,owner_id:null});S('move',E(m));
let o='none';for(let i=0;i<20;i++){o=await own(b);if(o!=='none')break;await sleep(3000);}S('move-path #'+xb.n,'->',o,JSON.stringify((await feed(b)).map(e=>e.action.replace('ticket.','')+(e.summary?.trigger?':'+e.summary.trigger:''))));R.b=b;
for(const t of [a,b])await patch(t,{status:'Closed'});
}finally{if(R.rid)R.off=await setA(R.rid,false);R.restore=E(await setPrefs(PB,AOB))+' same='+(JSON.stringify(await prefs(AOB))===JSON.stringify(PB));LED('mvctl: QA AO Dept B RR prefs changed and restored '+R.restore);save('mvctl.json',R);}
return R;
