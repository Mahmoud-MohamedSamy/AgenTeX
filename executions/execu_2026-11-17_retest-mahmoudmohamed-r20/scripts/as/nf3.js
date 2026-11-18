var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/scripts/as/";eval(fs.readFileSync(__AS+'lib.js','utf8'));
// NDC-2275 dev scenario: QA AO Dept B, dept threshold TH (5), offline allowed, pool A1+A3, 20 tickets at once. Expected per agent = TH - counted open (from API). RUNS env.
const AOB='4853562a-0b4d-45cb-ba34-9f2118fcd32c';NM[AOB]='AO-B';const TH=+(process.env.TH||5);
const R={runs:[]};const PB0=await prefs(AOB);save('nf3-prefs-orig.json',PB0);
const all=async()=>{const rows=[];for(let p=1;p<40;p++){const g=await api('GET','/modules/'+T+'/records?page='+p+'&per_page=100');const L=g.j?.data?.items||g.j?.data||[];for(const r of L){if(r.is_deleted)continue;const o={id:r.id};for(const x of r.data||[])o[x.field]=x.value?.value;rows.push(o);}if(!g.j?.meta?.more_records||!L.length)break;}return rows;};
const cnt=async()=>{const rows=await all();const c=u=>rows.filter(x=>x.owner===u&&x.department===AOB&&x.status!=='Closed'&&x.status!=='On Hold').length;return {A1:c(A1),A3:c(A3)};};
let rid;
try{
 R.prefs=E(await setPrefs({...PB0,assign_to_offline_agents:true,department_threshold_enabled:true,department_threshold:TH,agent_threshold_enabled:false,assign_backlogs:false,assign_on_closure:false},AOB));
 const K='R20NF3'+U;const r=await rule('round_robin','NF3 burst',[rrT(K,'sequential',[A1,A3])],{dept:AOB});rid=r.j?.data?.id;R.rule=E(r);await sleep(3000);
 const N=+(process.env.RUNS||2);
 for(let run=1;run<=N;run++){
  const before=await cnt();const wlb={A1:(await wl(A1,AOB)).dept,A3:(await wl(A3,AOB)).dept};const exp={A1:Math.max(0,TH-before.A1),A3:Math.max(0,TH-before.A3)};exp.waiting=20-exp.A1-exp.A3;
  const ids=await Promise.all(Array.from({length:20},(_,i)=>api('POST','/modules/'+T+'/records',{data:fields({subject:PFX+' '+K+' run'+run+' #'+(i+1),description:'nf3',department:AOB,status:'Open',priority:'high',owner:null})}).then(x=>x.j?.data?.id)));
  ids.forEach(id=>id&&made.tickets.push(id));saveMade();LED('NF-3 run '+run+': 20 tickets "'+PFX+' '+K+' run'+run+' #1..20" created in QA AO Dept B ('+ids.filter(Boolean).length+' ok)');
  const lags=[];for(const id of ids)if(id)lags.push((await waitDesk(id,600)).lag);
  await sleep(60000);
  const own1=[];for(const id of ids)own1.push(id?nm((await rec(id)).owner):'ERR');
  let dbl=0;for(const id of ids){if(!id)continue;if((await feed(id)).filter(e=>e.action==='ticket.auto_assigned').length>1)dbl++;}
  await sleep(30000);const own2=[];for(const id of ids)own2.push(id?nm((await rec(id)).owner):'ERR');
  const c=(L,o)=>L.filter(x=>x===o).length;
  const res={run,before,workloadBefore:wlb,expected:exp,got:{A1:c(own2,'A1'),A3:c(own2,'A3'),waiting:c(own2,'none')},other:own2.filter(x=>!['A1','A3','none'].includes(x)),doubleEntries:dbl,changedLate:own1.filter((x,i)=>x!==own2[i]).length,maxIngestLagS:Math.max(...lags)};
  res.ok=res.got.A1===exp.A1&&res.got.A3===exp.A3;R.runs.push(res);save('nf3.json',R);log(JSON.stringify(res));
  for(const id of ids.filter(Boolean))await patch(id,{status:'Closed'});await sleep(20000);
  R['afterClose'+run]=await cnt();save('nf3.json',R);
 }
}finally{
 if(rid)await setA(rid,false);
 R.restore=E(await setPrefs(PB0,AOB));R.same=JSON.stringify(await prefs(AOB))===JSON.stringify(PB0);LED('RR prefs QA AO Dept B changed for NF-3 and restored '+R.same);
}
save('nf3.json',R);return R;
