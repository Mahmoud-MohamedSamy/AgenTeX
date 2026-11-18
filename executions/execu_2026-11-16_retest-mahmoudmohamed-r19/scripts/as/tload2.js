var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/as/";
// Discriminating load check: AO-B A1 has 4 Open (all given by round robin), A3 has 6 Open (3 manual + 3 RR). Add 4 manual Open to A3 -> 10.
// True department count: A1 4 < A3 10 -> next 3 tickets all A1. If only RR-given tickets were counted (A1 4 vs A3 3) the first would go to A3.
eval(fs.readFileSync(__AS+'lib.js','utf8'));
const AOB='4853562a-0b4d-45cb-ba34-9f2118fcd32c';NM[AOB]='AO-B';const R={steps:[]};const S=(...a)=>R.steps.push(a.join(' '));
const PA=await prefs(DA),PB=await prefs(AOB);const rules=[];
const num=async id=>{for(let i=0;i<5;i++){const n=(await rec(id)).ticket_number;if(n)return n;await sleep(1000);}return '?';};
try{
 for(let i=1;i<=4;i++)await tk('LOAD2 A3 manual '+i,{owner:A3},AOB);
 await sleep(3000);S('start AO-B Open A1',(await wl(A1,AOB)).dept,'A3',(await wl(A3,AOB)).dept);
 S('prefs AOB',E(await setPrefs({...PB,assign_to_offline_agents:true,department_threshold_enabled:false,agent_threshold_enabled:false,assign_backlogs:false,assign_on_closure:false},AOB)));
 const K='R19ASLD5'+U;const r=await rule('round_robin','load check2 AOB',[rrT(K,'load',[A1,A3])],{dept:AOB});rules.push(r.j?.data?.id);S('rule',E(r));await sleep(2000);
 for(let i=1;i<=3;i++){const b=[(await wl(A1,AOB)).dept,(await wl(A3,AOB)).dept];const t=await tk(K+' LC'+i,{},AOB);S('LC'+i+' before A1 '+b[0]+' / A3 '+b[1]+' -> #'+(await num(t)),await waitOwn(t,24));}
 await setA(rules[0],false);
 // Dept A: why did the A2+A3 rule fail?
 S('prefs A',E(await setPrefs({...PA,assign_to_offline_agents:true,department_threshold_enabled:false,agent_threshold_enabled:false,assign_backlogs:false,assign_on_closure:false})));
 const K2='R19ASLD6'+U;let r2=await rule('round_robin','load check A2A3',[rrT(K2,'load',[A2,A3])]);S('rule A2+A3',E(r2));
 if(!r2.j?.data?.id){r2=await rule('round_robin','load check A1A3',[rrT(K2,'load',[A1,A3])]);S('rule A1+A3',E(r2));}
 rules.push(r2.j?.data?.id);await sleep(2000);
 for(let i=1;i<=3;i++){const t=await tk(K2+' LD'+i);S('LD'+i+' Dept A load -> #'+(await num(t)),await waitOwn(t,24));}
}finally{
 for(const id of rules)if(id)try{await setA(id,false);}catch(e){}
 R.restore=[E(await setPrefs(PA)),E(await setPrefs(PB,AOB))];R.same=[JSON.stringify(await prefs(DA))===JSON.stringify(PA),JSON.stringify(await prefs(AOB))===JSON.stringify(PB)];
 LED('RR prefs QA AS6 Dept A + QA AO Dept B changed for load check 2 and restored '+JSON.stringify(R.same));
}
save('tload2.json',R);return R;
