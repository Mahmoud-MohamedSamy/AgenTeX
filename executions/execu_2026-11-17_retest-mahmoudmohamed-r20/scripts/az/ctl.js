var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/scripts/az/";eval(fs.readFileSync(__AS+'lib.js','utf8'));
const AOB='4853562a-0b4d-45cb-ba34-9f2118fcd32c';const R={steps:[],t0:new Date().toISOString()};const S=(...a)=>{R.steps.push(a.join(' '));save('ctl.json',R);};
const PB=await prefs(AOB);save('ctl-prefs-orig.json',PB);S('orig prefs',JSON.stringify(PB));
S('prefs',E(await setPrefs({...PB,assign_to_offline_agents:true,department_threshold_enabled:false,agent_threshold_enabled:false,assign_backlogs:false,assign_on_closure:false},AOB)));
const K='CTL'+U;const r=await rule('round_robin','control owner',[rrT(K,'sequential',[O])],{dept:AOB,on:['create']});R.rid=r.j?.data?.id;S('rule',E(r));await sleep(5000);
const t=await tk(K+' control',{},AOB);R.t=t;const x=await waitRR(t,180);S('#'+x.n,'lag',x.lag,'->',x.o,JSON.stringify((await feed(t)).map(e=>e.action.replace('ticket.',''))));
R.off=await setA(R.rid,false);R.restore=E(await setPrefs(PB,AOB))+' same='+(JSON.stringify(await prefs(AOB))===JSON.stringify(PB));LED('ctl: QA AO Dept B RR prefs changed and restored '+R.restore);save('ctl.json',R);
return R;
