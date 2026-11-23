var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/scripts/as/";eval(fs.readFileSync(__AS+'lib.js','utf8'));
// Final control: QA AO Dept B, offline allowed, thresholds off, pool = owner (online, email on). Rule left active for the screenshot (ctl3end deactivates).
const AOB='4853562a-0b4d-45cb-ba34-9f2118fcd32c';const R={steps:[]};const S=(...a)=>{R.steps.push(a.join(' '));save('ctl3.json',R);};
const PB=await prefs(AOB);save('ctl3-prefs-orig.json',PB);
S('prefs',E(await setPrefs({...PB,assign_to_offline_agents:true,department_threshold_enabled:false,agent_threshold_enabled:false,assign_backlogs:false,assign_on_closure:false},AOB)));
const K='R20CT3'+U;const r=await rule('round_robin','control owner',[rrT(K,'sequential',[O,A1])],{dept:AOB,on:['create','update']});R.rid=r.j?.data?.id;S('rule',E(r));await sleep(5000);
const t=await tk(K+' control',{},AOB);R.t=t;const x=await waitRR(t,150);S('#'+x.n,'lag',x.lag,'->',x.o,JSON.stringify((await feed(t)).map(e=>e.action.replace('ticket.',''))));
const p=await patch(t,{priority:'low'});await sleep(45000);S('after update',E(p),await own(t));
return R;
