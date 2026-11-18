var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/as/";
// Repeat of the first load runs (which alternated A1/A3 although A3 had more Open): AO-B with A1 0 Open, A3 = 3 Open given by hand (owner set at create). 4 tickets, load pool A1+A3.
// Expected (department Open count): A1, A1, A1, then turns. MODE=fresh: A3's 3 hand tickets are created now; else reuse the 3 from 10:06.
eval(fs.readFileSync(__AS+'lib.js','utf8'));
const AOB='4853562a-0b4d-45cb-ba34-9f2118fcd32c';NM[AOB]='AO-B';const R={steps:[]};const S=(...a)=>R.steps.push(a.join(' '));
const PB=await prefs(AOB);const rules=[];
const num=async id=>{for(let i=0;i<5;i++){const n=(await rec(id)).ticket_number;if(n)return n;await sleep(1000);}return '?';};
try{
 // no closing: state prepared at 10:33 (tload4prep)

 await sleep(4000);S('waited since 10:33 | start AO-B Open A1',(await wl(A1,AOB)).dept,'A3',(await wl(A3,AOB)).dept);
 S('prefs AOB',E(await setPrefs({...PB,assign_to_offline_agents:true,department_threshold_enabled:false,agent_threshold_enabled:false,assign_backlogs:false,assign_on_closure:false},AOB)));
 const K='R19ASLD7'+U;const r=await rule('round_robin','load check4 AOB',[rrT(K,'load',[A1,A3])],{dept:AOB});rules.push(r.j?.data?.id);S('rule',E(r));await sleep(2000);
 for(let i=1;i<=5;i++){const b=[(await wl(A1,AOB)).dept,(await wl(A3,AOB)).dept];const t=await tk(K+' LE'+i,{},AOB);S('LE'+i+' before A1 '+b[0]+' / A3 '+b[1]+' -> #'+(await num(t)),await waitOwn(t,24));}
}finally{
 for(const id of rules)if(id)try{await setA(id,false);}catch(e){}
 R.restore=E(await setPrefs(PB,AOB));R.same=JSON.stringify(await prefs(AOB))===JSON.stringify(PB);
 LED('RR prefs QA AO Dept B changed for load check 4 ('+(process.env.MODE||'old')+') and restored '+R.same);
}
save('tload4.json',R);return R;
