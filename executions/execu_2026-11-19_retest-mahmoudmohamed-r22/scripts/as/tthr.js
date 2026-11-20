var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/scripts/as/";eval(fs.readFileSync(__AS+'lib.js','utf8'));
// NDC-2275 key check: the threshold the rule applies = the agent's counted tickets in the dept (not Closed, not On Hold), computed from the API. Single-agent rule per agent, step dept threshold from expected+1 up.
const AOB=process.env.DEPT||'4853562a-0b4d-45cb-ba34-9f2118fcd32c';NM[AOB]='AO-B';const TAG=process.env.TAG||'thr';const R={at:new Date().toISOString(),dept:AOB,steps:[]};const S=(...a)=>{const l=a.join(' ');R.steps.push(l);log(l);save(TAG+'.json',R);};
const all=async()=>{const rows=[];for(let p=1;p<40;p++){const g=await api('GET','/modules/'+T+'/records?page='+p+'&per_page=100');const L=g.j?.data?.items||g.j?.data||[];for(const r of L){if(r.is_deleted)continue;const o={id:r.id};for(const x of r.data||[])o[x.field]=x.value?.value;rows.push(o);}if(!g.j?.meta?.more_records||!L.length)break;}return rows;};
const K='R20TH'+U;const PB=await prefs(AOB);save(TAG+'-prefs-orig.json',PB);let rids=[];
const P=o=>setPrefs({...PB,assign_to_offline_agents:true,department_threshold_enabled:true,agent_threshold_enabled:false,assign_backlogs:false,assign_on_closure:false,...o},AOB);
const AG=(process.env.AG||'A1,A3').split(',');const MAP={A1,A2,A3};
try{
 for(const n of AG){const u=MAP[n];
  const r=await rule('round_robin','thr '+n,[rrT(K+n,'sequential',[u])],{dept:AOB});rids.push(r.j?.data?.id);
  const rows=(await all()).filter(x=>x.owner===u&&x.department===AOB&&x.status!=='Closed');const o=rows.filter(x=>x.status!=='On Hold').length;
  S(n,'not-closed in dept (API):',JSON.stringify(rows.map(x=>[x.ticket_number||'?',x.status])),'=> expected count',o,'| workload API',JSON.stringify((await wl(u,AOB)).dept));
  let got=null;
  for(let k=1;k<=4;k++){await P({department_threshold:o+k-1});await sleep(2500);const t=await tk(K+n+' thr'+(o+k-1),{},AOB);const x=await waitRR(t,60);const w=x.o;await patch(t,{status:'Closed'});await sleep(2500);S(n,'expected',o,'thr',o+k-1,'#'+x.n,'deskLag '+x.lag+'s','->',w,k===1?'(expect none: at threshold)':k===2?'(expect assigned)':'(PHANTOM)');if(w!=='none'){got=k-2;break;}}
  R[n]={expected:o,extraCounted:got};S(n,'extra counted =',got);
  await setA(rids[rids.length-1],false);
 }
}finally{for(const id of rids)if(id)await setA(id,false);R.same=E(await setPrefs(PB,AOB))+' '+(JSON.stringify(await prefs(AOB))===JSON.stringify(PB));LED(TAG+': dept '+AOB.slice(0,8)+' RR prefs changed and restored '+R.same);}
save(TAG+'.json',R);return R;
