var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/as/";
// NDC-2275 NF-3: 20 tickets at the same moment, pool A1+A3 in QA AO Dept B, department threshold 5, both start with 0 Open there -> expect 5, 5, 10 waiting; no double assignment. RUNS env (default 5).
eval(fs.readFileSync(__AS+'lib.js','utf8'));
const AOB='4853562a-0b4d-45cb-ba34-9f2118fcd32c';NM[AOB]='AO-B';
const R={runs:[]};const PB0=await prefs(AOB);save('nf3-prefs-orig.json',PB0);
// my tickets in AO-B owned by A1/A3 -> Closed so both start at 0 Open
const mine=async()=>{const out=[];for(const id of made.tickets){if(typeof id!=='string')continue;const o=await rec(id);if(o.department===AOB&&o.status==='Open'&&(o.owner===A1||o.owner===A3))out.push(id);}return out;};
const closeAll=async ids=>{for(const id of ids)await patch(id,{status:'Closed'});};
let rid;
try{
 R.start={A1:(await wl(A1,AOB)).dept,A3:(await wl(A3,AOB)).dept};
 const PH=+(process.env.PH||2);const a1=(await wl(A1,AOB)).dept,a3=(await wl(A3,AOB)).dept;R.thresholds={A1:a1+PH+5,A3:a3+5,note:'A1 counted '+PH+' above its Open tickets (probe tcount), so room = 5 each'};
 R.prefs=E(await setPrefs({...PB0,assign_to_offline_agents:true,department_threshold_enabled:false,agent_threshold_enabled:true,agent_thresholds:[{user_id:A1,threshold:a1+PH+5},{user_id:A3,threshold:a3+5}],assign_backlogs:false,assign_on_closure:false},AOB));
 const K='R19ASNF3'+U;const r=await rule('round_robin','NF3 burst',[rrT(K,'sequential',[A1,A3])],{dept:AOB});rid=r.j?.data?.id;R.rule=E(r);await sleep(2500);
 const N=+(process.env.RUNS||5);
 for(let run=1;run<=N;run++){
  const before={A1:(await wl(A1,AOB)).dept,A3:(await wl(A3,AOB)).dept};
  const t0=Date.now();
  const ids=await Promise.all(Array.from({length:20},(_,i)=>api('POST','/modules/'+T+'/records',{data:fields({subject:PFX+' '+K+' run'+run+' #'+(i+1),description:'nf3',department:AOB,status:'Open',priority:'high',owner:null})}).then(x=>x.j?.data?.id)));
  const ms=Date.now()-t0;ids.forEach(id=>id&&made.tickets.push(id));saveMade();LED('NF-3 run '+run+': 20 tickets created in QA AO Dept B ('+ids.filter(Boolean).length+' ok)');
  await sleep(30000);
  const own=[];for(const id of ids){own.push(id?nm((await rec(id)).owner):'ERR');}
  const cnt=o=>own.filter(x=>x===o).length;
  let dbl=0;const multi=[];for(const id of ids){if(!id)continue;const n=(await feed(id)).filter(e=>e.action==='ticket.auto_assigned').length;if(n>1){dbl++;multi.push(id.slice(0,8));}}
  // recheck owners at 60s for late changes
  await sleep(20000);const own2=[];for(const id of ids)own2.push(id?nm((await rec(id)).owner):'ERR');
  const res={run,createMs:ms,before,A1:cnt('A1'),A3:cnt('A3'),waiting:cnt('none'),other:own.filter(x=>!['A1','A3','none'].includes(x)),doubleEntries:dbl,multi,changedBy60s:own.filter((x,i)=>x!==own2[i]).length};
  R.runs.push(res);save('nf3b.json',R);
  // reset: close all 20 so the next run starts at 0 Open
  await closeAll(ids.filter(Boolean));await sleep(4000);
 }
}finally{
 if(rid)await setA(rid,false);
 R.restore=E(await setPrefs(PB0,AOB));R.same=JSON.stringify(await prefs(AOB))===JSON.stringify(PB0);LED('RR prefs QA AO Dept B changed for NF-3 and restored '+R.same);
}
save('nf3b.json',R);return R;
