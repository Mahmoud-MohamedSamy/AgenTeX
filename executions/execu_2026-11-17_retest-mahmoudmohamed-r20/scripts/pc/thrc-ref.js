var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/scripts/az/";eval(fs.readFileSync(__AS+'lib.js','utf8'));
// NDC-2275 key check via the MOVE path (create path assigns nothing today). Single-agent rule; dept threshold at count, count+1; then On Hold check.
const AOB='4853562a-0b4d-45cb-ba34-9f2118fcd32c';NM[AOB]='AO-B';const TAG='thrc';const R={at:new Date().toISOString(),steps:[]};const S=(...a)=>{const l=a.join(' ');R.steps.push(l);save(TAG+'.json',R);};
const all=async()=>{const rows=[];for(let p=1;p<60;p++){const g=await api('GET','/modules/'+T+'/records?page='+p+'&per_page=100');const L=g.j?.data?.items||g.j?.data||[];for(const r of L){if(r.is_deleted)continue;const o={id:r.id};for(const x of r.data||[])o[x.field]=x.value?.value;rows.push(o);}if(!g.j?.meta?.more_records||!L.length)break;}return rows;};
const K='THC'+U;const PB=await prefs(AOB);save(TAG+'-prefs-orig.json',PB);let rids=[];
const P=o=>setPrefs({...PB,assign_to_offline_agents:true,department_threshold_enabled:true,agent_threshold_enabled:false,assign_backlogs:false,assign_on_closure:false,...o},AOB);
const mv=async(key)=>{const t=await tk(key,{},AOB);const x=await waitRR(t,90);const f=await feed(t);return {t,n:x.n,o:x.o,fe:f.filter(e=>/auto_assign|backlog|skip/.test(e.action)).map(e=>e.action.replace('ticket.','')+(e.summary?.reason?':'+e.summary.reason:''))};};
const MAP={A1,A3};const keep=[];
try{
 for(const n of ['A1','A3']){const u=MAP[n];
  const r=await rule('round_robin','thr '+n,[rrT(K+n,'sequential',[u])],{dept:AOB,on:['create','update']});rids.push(r.j?.data?.id);
  const rows0=await all();const rows=rows0.filter(x=>x.owner===u&&x.department===AOB&&x.status!=='Closed');const o=rows.filter(x=>x.status!=='On Hold').length;
  const other=rows0.filter(x=>x.owner===u&&x.department!==AOB&&x.status==='Open').length;
  S(n,'not-closed in AO-B (API):',JSON.stringify(rows.map(x=>[x.ticket_number||'?',x.status])),'=> expected count',o,'| workload API',JSON.stringify((await wl(u,AOB)).dept),'| Open in other depts',other);
  R[n]={expected:o,other};
  await P({department_threshold:o});await sleep(2500);
  let x=await mv(K+n+' at thr '+o);S(n,'thr',o,'(=count, expect wait) #'+x.n,'->',x.o,JSON.stringify(x.fe));R[n].atCount=x.o;keep.push(x.t);
  await P({department_threshold:o+1});await sleep(2500);
  x=await mv(K+n+' at thr '+(o+1));S(n,'thr',o+1,'(=count+1, expect assigned) #'+x.n,'->',x.o,JSON.stringify(x.fe));R[n].atPlus1=x.o;keep.push(x.t);
  if(x.o!=='none'){
   // now agent has o+1 Open; same threshold -> must wait
   let y=await mv(K+n+' full again');S(n,'thr',o+1,'agent now at',o+1,'(expect wait) #'+y.n,'->',y.o,JSON.stringify(y.fe));R[n].full=y.o;keep.push(y.t);
   // On Hold not counted
   S(n,'set #'+x.n+' On Hold',E(await patch(x.t,{status:'On Hold'})));await sleep(3000);
   y=await mv(K+n+' after onhold');S(n,'thr',o+1,'after On Hold (expect assigned) #'+y.n,'->',y.o,JSON.stringify(y.fe));R[n].onhold=y.o;keep.push(y.t);
  }else{for(let k=2;k<=3;k++){await P({department_threshold:o+k});await sleep(2500);const z=await mv(K+n+' at thr '+(o+k));S(n,'thr',o+k,'#'+z.n,'->',z.o,'(phantom probe)');keep.push(z.t);if(z.o!=='none')break;}}
  await setA(rids[rids.length-1],false);
 }
}finally{for(const id of rids)if(id)await setA(id,false);for(const t of keep)await patch(t,{status:'Closed'});R.closed=keep.length;R.same=E(await setPrefs(PB,AOB))+' '+(JSON.stringify(await prefs(AOB))===JSON.stringify(PB));LED(TAG+': QA AO Dept B RR prefs changed and restored '+R.same+'; '+keep.length+' QA RT20 AZ tickets closed');}
save(TAG+'.json',R);return R;
