var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/as/";
eval(fs.readFileSync(__AS+'lib.js','utf8'));
const AOB='4853562a-0b4d-45cb-ba34-9f2118fcd32c';NM[AOB]='AO-B';
const I=JSON.parse(fs.readFileSync(OUT+'ids.json','utf8'));const R={steps:[]};const S=(...a)=>{R.steps.push(a.join(' '));};
const P0=await prefs(DA);const PB0=await prefs(AOB);save('t2-prefs-orig.json',{A:P0,AOB:PB0});
const num=async id=>{for(let i=0;i<5;i++){const n=(await rec(id)).ticket_number;if(n)return n;await sleep(1000);}return '?';};
const sk=async id=>JSON.stringify((await rec(id)).skills||[]);
const T1=async(k,ex={},d=DA)=>{const t=await tk(k,ex,d);if(typeof t!=='string')throw new Error('create failed '+JSON.stringify(t));return t;};
const base={...P0,assign_to_offline_agents:true,assign_backlogs:false,assign_on_closure:false,agent_threshold_enabled:false,agent_thresholds:[],department_threshold_enabled:false};
const rules=[];const S1='QA RT19 AS S1',S2='QA RT19 AS S2',S3='QA RT19 AS S3',IN='QA RT19 AS Inact';
const cs=async(n,f)=>{try{await f();}catch(e){S(n+' ERR '+e.message.slice(0,300));}};
const ONLY=(process.env.ONLY||'2970,load,2931,2932,2933,2971').split(',');
try{
 if(ONLY.includes('2970'))await cs('2970',async()=>{const c=(await wl(A3)).dept;
  const K='R19AS70b'+U;const r=await rule('round_robin','2970 skill A3',[rrT(K,'skill',[A3])]);rules.push(r.j?.data?.id);
  S('2970 workload(A3, Dept A incl. On Hold)',c,'all',(await wl(A3)).all);
  S('prefs thr4',E(await setPrefs({...base,department_threshold_enabled:true,department_threshold:4})));await sleep(2500);
  let t=await T1(K+' e skill S1 thr4',{skills:[S1]});S('2970 e) skill RR thr 4, A3 Open in dept 3 (5 with On Hold, 9 all depts) -> #'+(await num(t)),await waitOwn(t,24),'skills',await sk(t));R.e2970=t;
  t=await T1(K+' f skill S1 thr4 full',{skills:[S1]});await sleep(16000);S('2970 f) control, A3 Open in dept 4 -> #'+(await num(t)),await own(t),'skills',await sk(t));
  await setA(r.j.data.id,false);S('prefs no thr',E(await setPrefs(base)));});
 else S('prefs base',E(await setPrefs(base)));
 if(ONLY.includes('load'))await cs('load',async()=>{S('prefs AOB offline',E(await setPrefs({...PB0,assign_to_offline_agents:true},AOB)));
  const K='R19ASLD2'+U;const r=await rule('round_robin','2824 load AOB b',[rrT(K,'load',[A1,A3])],{dept:AOB});rules.push(r.j?.data?.id);
  for(let i=1;i<=4;i++){const a1=(await wl(A1,AOB)).dept,a3=(await wl(A3,AOB)).dept;const t=await T1(K+' L'+i,{},AOB);S('load L'+i+' (AO-B open before: A1 '+a1+', A3 '+a3+') -> #'+(await num(t)),await waitOwn(t,24));}
  await setA(r.j.data.id,false);S('restore AOB',E(await setPrefs(PB0,AOB)));});
 if(ONLY.includes('2931'))await cs('2931',async()=>{const K='R19AS31'+U;const r=await rule('round_robin','2931 skill A1 A3',[rrT(K,'skill',[A1,A3])],{on:['create','update']});rules.push(r.j?.data?.id);
  let t=await T1(K+' a S3+S1',{skills:[S3,S1]});S('2931 a) skills S3 (nobody) + S1 (A3) -> #'+(await num(t)),await waitOwn(t,24),await sk(t));R.a2931=t;
  t=await T1(K+' b S3 only',{skills:[S3]});await sleep(16000);S('2931 b) S3 only (nobody holds) -> #'+(await num(t)),await own(t));R.b2931=t;
  for(const x of ['c1','c2','c3']){t=await T1(K+' '+x+' S1+S2',{skills:[S1,S2]});S('2931 '+x+') S1 (A3) + S2 (A1) -> #'+(await num(t)),await waitOwn(t,24));}
  await setA(r.j.data.id,false);
  t=await T1('R19ASABS'+U+' assign by skills S3+S1',{skills:[S3,S1]});await sleep(5000);S('2931 d) no rule; owner before',await own(t));
  let a=await api('POST','/desk/tickets/'+t+'/skills/assign',{});await sleep(3000);S('2931 d) Assign by Skills S3+S1 ->',a.s,a.t.slice(0,250),'owner',await own(t),'#'+(await num(t)));R.d2931=t;
  t=await T1('R19ASABS'+U+' assign by skills S3 only',{skills:[S3]});await sleep(4000);a=await api('POST','/desk/tickets/'+t+'/skills/assign',{});S('2931 e) Assign by Skills S3 only ->',a.s,a.t.slice(0,300),'owner',await own(t),'#'+(await num(t)));R.e2931=t;
  t=await T1('R19ASABS'+U+' assign by skills none');await sleep(4000);a=await api('POST','/desk/tickets/'+t+'/skills/assign',{});S('2931 f) Assign by Skills no skills ->',a.s,a.t.slice(0,300));});
 if(ONLY.includes('2932'))await cs('2932',async()=>{const K='R19AS32'+U;const r=await rule('round_robin','2932 skill A3',[rrT(K,'skill',[A3])],{on:['create','update']});rules.push(r.j?.data?.id);
  S('presence',await presence());
  const t=await T1(K+' a no skills');await sleep(18000);S('2932 a) no skills, pool A3 -> #'+(await num(t)),await own(t),'skills',await sk(t));R.a2932=t;
  const bl=await api('GET','/desk/assignment-backlog?department_id='+DA);S('2932 backlog GET',bl.s,'has ticket:',(bl.t||'').includes(t),(bl.t||'').slice(0,200));
  const f=(await feed(t)).map(e=>e.action);S('2932 a) feed',JSON.stringify(f));
  S('2932 b) add skill S1 via edit',(await patch(t,{skills:[S1]})).s);S('2932 b) -> ',await waitOwn(t,24),await sk(t));
  const t2=await T1(K+' c no skills 2');await sleep(18000);S('2932 c) no skills again -> #'+(await num(t2)),await own(t2));
  await setA(r.j.data.id,false);});
 if(ONLY.includes('2933'))await cs('2933',async()=>{const t=await T1('R19AS33'+U+' api mixed',{owner:O,skills:[S1,IN,'QA SK13 S1','QA AS6 sk1']});await sleep(2000);S('2933 a) create Dept A with S1, Inact(inactive), QA SK13 S1 (other dept), QA AS6 sk1 (Dept A active) -> kept',await sk(t),'#'+(await num(t)));
  const p=await patch(t,{skills:[S2,IN,'QA SK13 S2']});await sleep(2000);S('2933 b) edit to S2+Inact+QA SK13 S2 ->',p.s,'kept',await sk(t));R.t2933=t;});
 if(ONLY.includes('2971'))await cs('2971',async()=>{const b=JSON.parse(fs.readFileSync(OUT+'baseline.json','utf8'));const TYPE=b.skillsA.skills[1].type_id;
  const c=await api('POST','/desk/skills?department_id='+DA,{department_id:DA,name:'QA RT19 AS Del',type_id:TYPE,description:'QA RT19 AS lane',is_active:true,criteria:{conditions:[{field_key:'subject',operator:'contains',value:'QART19ASNEVER'}],pattern:null}});
  const id=c.j?.data?.id;LED('skill created '+id+' "QA RT19 AS Del" (for 2971 delete)');I.Del=id;fs.writeFileSync(OUT+'ids.json',JSON.stringify(I));
  const t=await T1('R19AS71'+U+' with Del before delete',{owner:O,skills:['QA RT19 AS Del',S1]});await sleep(1500);S('2971 a) ticket with Del before delete',await sk(t));R.t2971a=t;
  const d=await api('DELETE','/desk/skills/'+id);LED('skill deleted '+id+' QA RT19 AS Del -> '+d.s);S('2971 delete skill',d.s);await sleep(3000);
  S('2971 b) existing ticket after delete',await sk(t));
  const r2=await tk('R19AS71'+U+' with Del after delete',{owner:O,skills:['QA RT19 AS Del',S1]});S('2971 c) create with deleted skill',typeof r2==='string'?await sk(r2):JSON.stringify(r2));R.t2971c=r2;
  const deps=(await api('GET','/desk/departments')).j?.data;const DL=Array.isArray(deps)?deps:(deps?.items||[]);const d12=DL.find(x=>x.name==='QA SK12 Dept A');
  const l12=(await api('GET','/desk/skills?department_id='+d12.id)).j?.data?.skills||[];S('2971 QA SK12 Dept A skills now',l12.length,l12.slice(0,5).map(s=>s.name).join(','));});
}finally{
 for(const id of rules)if(id)try{await setA(id,false);}catch(e){}
 R.restoreA=E(await setPrefs(P0));R.restoreB=E(await setPrefs(PB0,AOB));
 R.diff=[JSON.stringify(await prefs(DA))===JSON.stringify(P0),JSON.stringify(await prefs(AOB))===JSON.stringify(PB0)];
 LED('RR prefs QA AS6 Dept A + QA AO Dept B changed for t2 ('+ONLY+') and restored '+JSON.stringify(R.diff));
}
save('t2.json',R);return R;
