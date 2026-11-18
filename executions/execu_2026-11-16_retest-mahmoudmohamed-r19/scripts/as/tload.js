var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/as/";
// Load-based method count check (NDC-2824/2970 developer claim: load-based uses the department's open tickets).
// L-A: QA AO Dept B, A1 0 Open there (my tickets closed), A3 6 Open (manual owner) -> 4 new tickets should all go to A1.
// L-B: QA AS6 Dept A, pool A2 (≈67 Open in dept) + A3 (few) -> 3 new tickets should all go to A3.
eval(fs.readFileSync(__AS+'lib.js','utf8'));
const AOB='4853562a-0b4d-45cb-ba34-9f2118fcd32c';NM[AOB]='AO-B';const R={steps:[]};const S=(...a)=>R.steps.push(a.join(' '));
const PA=await prefs(DA),PB=await prefs(AOB);save('tload-prefs-orig.json',{A:PA,AOB:PB});const rules=[];
const num=async id=>{for(let i=0;i<5;i++){const n=(await rec(id)).ticket_number;if(n)return n;await sleep(1000);}return '?';};
try{
 // close my Open A1 tickets in AO-B; count A3 Open there
 let a3=[];for(const id of made.tickets){if(typeof id!=='string')continue;const o=await rec(id);if(o.department!==AOB||o.status!=='Open')continue;if(o.owner===A1)await patch(id,{status:'Closed'});if(o.owner===A3)a3.push(id);}
 for(let i=a3.length;i<6;i++)a3.push(await tk('LOAD A3 manual '+i,{owner:A3},AOB));
 await sleep(3000);S('L-A start: AO-B Open A1',(await wl(A1,AOB)).dept,'A3',(await wl(A3,AOB)).dept);
 S('prefs AOB',E(await setPrefs({...PB,assign_to_offline_agents:true,department_threshold_enabled:false,agent_threshold_enabled:false,assign_backlogs:false,assign_on_closure:false},AOB)));
 const K='R19ASLD3'+U;const r=await rule('round_robin','load check AOB',[rrT(K,'load',[A1,A3])],{dept:AOB});rules.push(r.j?.data?.id);await sleep(2000);
 for(let i=1;i<=4;i++){const b=[(await wl(A1,AOB)).dept,(await wl(A3,AOB)).dept];const t=await tk(K+' LA'+i,{},AOB);S('L-A'+i+' before A1 '+b[0]+' / A3 '+b[1]+' -> #'+(await num(t)),await waitOwn(t,24));}
 await setA(rules[0],false);
 S('prefs A',E(await setPrefs({...PA,assign_to_offline_agents:true,department_threshold_enabled:false,agent_threshold_enabled:false,assign_backlogs:false,assign_on_closure:false})));
 const K2='R19ASLD4'+U;const r2=await rule('round_robin','load check A',[rrT(K2,'load',[A2,A3])]);rules.push(r2.j?.data?.id);await sleep(2000);
 for(let i=1;i<=3;i++){const b=[(await wl(A2)).dept,(await wl(A3)).dept];const t=await tk(K2+' LB'+i);S('L-B'+i+' before A2 '+b[0]+' / A3 '+b[1]+' (workload incl. On Hold) -> #'+(await num(t)),await waitOwn(t,24));R['LB'+i]=t;}
 await setA(rules[1],false);
}finally{
 for(const id of rules)if(id)try{await setA(id,false);}catch(e){}
 R.restore=[E(await setPrefs(PA)),E(await setPrefs(PB,AOB))];R.same=[JSON.stringify(await prefs(DA))===JSON.stringify(PA),JSON.stringify(await prefs(AOB))===JSON.stringify(PB)];
 LED('RR prefs QA AS6 Dept A + QA AO Dept B changed for load check and restored '+JSON.stringify(R.same));
}
save('tload.json',R);return R;
