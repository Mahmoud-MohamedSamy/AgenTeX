var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/scripts/az/";eval(fs.readFileSync(__AS+'lib.js','utf8'));
const AOB='4853562a-0b4d-45cb-ba34-9f2118fcd32c';const R={steps:[]};const S=(...a)=>{R.steps.push(a.join(' '));save('oh.json',R);};
const M=JSON.parse(fs.readFileSync(OUT+'made.json','utf8'));let c=0;for(const id of M.tickets){const r=await rec(id);if(r.status!=='Closed'){await patch(id,{status:'Closed'});c++;}}S('closed leftovers',c);await sleep(5000);
const W=async t=>{for(let i=0;i<40;i++){const o=await own(t);if(o!=='none')return o;const f=await feed(t);if(f.some(e=>/auto_assign/.test(e.action))){await sleep(5000);return 'feed:'+(await own(t));}await sleep(3000);}return 'none';};
const PB=await prefs(AOB);save('oh-prefs-orig.json',PB);let rid;const ids=[];
try{
 const n=(await wl(A3,AOB)).dept;S('A3 Open in AO-B (workload)',n);
 S('prefs thr',n+1,E(await setPrefs({...PB,assign_to_offline_agents:true,department_threshold_enabled:true,department_threshold:n+1,agent_threshold_enabled:false,assign_backlogs:false,assign_on_closure:false},AOB)));
 const K='OH'+U;const r=await rule('round_robin','onhold A3',[rrT(K,'sequential',[A3])],{dept:AOB,on:['create']});rid=r.j?.data?.id;S('rule',E(r));await sleep(3000);
 const t1=await tk(K+' one',{},AOB);ids.push(t1);await waitDesk(t1);S('t1 ->',await W(t1),'(expect A3)');
 const t2=await tk(K+' two full',{},AOB);ids.push(t2);await waitDesk(t2);await sleep(45000);S('t2 ->',await own(t2),'(expect none: at threshold)');
 S('t1 On Hold',E(await patch(t1,{status:'On Hold'})));await sleep(8000);S('desk status t1',(await api('GET','/desk/tickets/'+t1)).j?.data?.status,'workload',(await wl(A3,AOB)).dept);
 const t3=await tk(K+' three after hold',{},AOB);ids.push(t3);await waitDesk(t3);S('t3 ->',await W(t3),'(expect A3: On Hold not counted)');
 S('t2 now',await own(t2));
}finally{if(rid)await setA(rid,false);for(const t of ids)await patch(t,{status:'Closed'});R.same=E(await setPrefs(PB,AOB))+' '+(JSON.stringify(await prefs(AOB))===JSON.stringify(PB));LED('oh: QA AO Dept B RR prefs changed and restored '+R.same+'; tickets closed');save('oh.json',R);}
return R;
