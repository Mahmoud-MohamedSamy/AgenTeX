var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/as/";
eval(fs.readFileSync(__AS+'lib.js','utf8'));
const AOB='4853562a-0b4d-45cb-ba34-9f2118fcd32c';NM[AOB]='AO-B';
const I=JSON.parse(fs.readFileSync(OUT+'ids.json','utf8'));const R={steps:[]};const S=(...a)=>{R.steps.push(a.join(' '));};
const P0=await prefs(DA);const PB0=await prefs(AOB);save('t2824-prefs-orig.json',{A:P0,AOB:PB0});
const num=async id=>(await rec(id)).ticket_number;
const base={...P0,assign_to_offline_agents:true,assign_backlogs:false,assign_on_closure:false,agent_threshold_enabled:false,agent_thresholds:[]};
const rules=[];
try{
 // make Inact inactive
 const sk=(await api('GET','/desk/skills?department_id='+DA)).j.data.skills.find(s=>s.id===I['QA RT19 AS Inact']);
 S('inact', (await api('PUT','/desk/skills/'+sk.id,{name:sk.name,type_id:sk.type_id,description:sk.description,is_active:false,criteria:sk.criteria})).s);
 // other-dept A3 tickets: 3 open in QA AO Dept B; Dept A: on hold a61dfeca exists (+1 open)
 const ob=[];for(let i=1;i<=3;i++)ob.push(await tk('2824 other dept A3 '+i,{owner:A3},AOB));
 const openA=await tk('2824 A3 open in dept',{owner:A3});
 await sleep(3000);
 S('A3 workload: dept A',JSON.stringify(await wl(A3)),'AO-B',(await wl(A3,AOB)).dept);
 const K='R19AS24'+U;const r=await rule('round_robin','2824 seq A3',[rrT(K,'sequential',[A3])]);rules.push(r.j?.data?.id);S('rule',E(r));
 // a) dept threshold 2: A3 has 1 Open in Dept A (+1 On Hold in A, +3 Open in AO-B) -> expect assigned
 S('prefs thr2',E(await setPrefs({...base,department_threshold_enabled:true,department_threshold:2})));await sleep(2500);
 let t=await tk(K+' a thr2');S('a) thr 2, A3 open in dept 1 -> #'+(await num(t)),await waitOwn(t,24));R.a=t;
 // b) A3 now 2 open in dept -> expect wait
 t=await tk(K+' b thr2 full');await sleep(16000);S('b) thr 2, A3 open 2 -> #'+(await num(t)),await own(t));R.b=t;
 // c) put openA On Hold -> A3 open 1 -> expect assigned
 S('openA -> On Hold',(await patch(openA,{status:'On Hold'})).s);await sleep(3000);
 t=await tk(K+' c after on hold');S('c) thr 2 after one Open->On Hold -> #'+(await num(t)),await waitOwn(t,24));R.c=t;
 // d) agent threshold A3=3, dept threshold off: A3 open 2 -> assigned, next waits
 S('prefs agent thr A3=3',E(await setPrefs({...base,department_threshold_enabled:false,department_threshold:40,agent_threshold_enabled:true,agent_thresholds:[{user_id:A3,threshold:3}]})));await sleep(2500);
 t=await tk(K+' d1 agent thr3');S('d1) agent thr 3, A3 open 2 -> #'+(await num(t)),await waitOwn(t,24));
 t=await tk(K+' d2 agent thr3 full');await sleep(16000);S('d2) agent thr 3, A3 open 3 -> #'+(await num(t)),await own(t));
 await setA(rules[0],false);
 // e) NDC-2970 skill-based: dept threshold 4, A3 open 3 in dept (8 if On Hold + other dept counted)
 const K2='R19AS70'+U;const r2=await rule('round_robin','2970 skill A3',[rrT(K2,'skill',[A3])]);rules.push(r2.j?.data?.id);
 S('prefs thr4',E(await setPrefs({...base,department_threshold_enabled:true,department_threshold:4})));await sleep(2500);
 S('A3 now: dept',JSON.stringify((await wl(A3)).raw?.open_tickets),'all',(await wl(A3)).all);
 t=await tk(K2+' e skill S1 thr4',{skills:[I['QA RT19 AS S1']]});S('e) skill RR, thr 4, A3 open 3 in dept -> #'+(await num(t)),await waitOwn(t,24),'skills',JSON.stringify((await rec(t)).skills));R.e=t;
 t=await tk(K2+' f skill S1 thr4 full',{skills:[I['QA RT19 AS S1']]});await sleep(16000);S('f) skill RR, thr 4, A3 open 4 -> #'+(await num(t)),await own(t));
 await setA(rules[1],false);
 // g) load-based in QA AO Dept B pool A1,A3: AO-B open A1 0, A3 3; all-depts A1 80, A3 ~9 -> dept-only count says A1
 S('prefs AOB offline',E(await setPrefs({...PB0,assign_to_offline_agents:true},AOB)));
 const K3='R19ASLD'+U;const r3=await rule('round_robin','2824 load AOB',[rrT(K3,'load',[A1,A3])],{dept:AOB});rules.push(r3.j?.data?.id);S('rule3',E(r3));
 S('AOB open: A1',(await wl(A1,AOB)).dept,'A3',(await wl(A3,AOB)).dept,'| all: A1',(await wl(A1)).all,'A3',(await wl(A3)).all);
 for(const x of ['g1','g2']){t=await tk(K3+' '+x+' load',{},AOB);S(x+') load AO-B -> #'+(await num(t)),await waitOwn(t,24));}
 await setA(rules[2],false);
 R.feedA=(await feed(R.a)).map(e=>e.action+' '+JSON.stringify(e.summary||'').slice(0,300));
 R.feedB=(await feed(R.b)).map(e=>e.action+' '+JSON.stringify(e.summary||'').slice(0,300));
}finally{
 for(const id of rules)if(id)try{await setA(id,false);}catch(e){}
 R.restoreA=E(await setPrefs(P0));R.restoreB=E(await setPrefs(PB0,AOB));
 R.diff=[JSON.stringify(await prefs(DA))===JSON.stringify(P0),JSON.stringify(await prefs(AOB))===JSON.stringify(PB0)];
 LED('RR prefs QA AS6 Dept A + QA AO Dept B changed for 2824/2970 and restored '+JSON.stringify(R.diff));
}
save('t2824.json',R);return R;
