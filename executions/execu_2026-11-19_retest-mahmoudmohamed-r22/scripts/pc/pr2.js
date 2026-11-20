eval(fs.readFileSync("D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/scripts/pc/hdr.js",'utf8'));
// NDC-3076 part 2 (after pr.js hung on a network call at the control step): control AS6 Dept A, move case via Desk move, then restore + close.
{const _a2=api;api=(m,p,b)=>Promise.race([_a2(m,p,b),new Promise((_,rej)=>setTimeout(()=>rej(new Error('timeout 60s '+m+' '+p.slice(0,60))),60000))]);}
const LOCK=RUN+'/locks/qa-ao-dept-b-and-as6a-rr-prefs.lock';fs.writeFileSync(LOCK,'PC lane NDC-3076 part 2 '+new Date().toISOString());
const TAG='pr2';const R={at:new Date().toISOString(),steps:[],rows:{}};const S=(...a)=>{const l=new Date().toISOString().slice(11,19)+' '+a.join(' ');R.steps.push(l);save(TAG+'.json',R);};
const ORIG=JSON.parse(fs.readFileSync(OUT+'pr-prefs-orig.json','utf8'));const PB=ORIG.AOB,PD=ORIG.DA;
const P=(o,d=AOB,base=PB)=>setPrefs({...base,assign_to_offline_agents:true,department_threshold_enabled:true,agent_threshold_enabled:false,assign_backlogs:false,assign_on_closure:false,...o},d);
const K='PD'+U;let rids=[];const closeL=[];
const probe=async(key,dept=AOB)=>{const t=await tk(key,{},dept);if(typeof t!=='string')return {t:null,n:'?',o:'ERR '+JSON.stringify(t),fe:[]};closeL.push(t);const x=await waitRR(t,90);await sleep(3000);const o=await own(t);const f=await feed(t);return {t,n:x.n,o,lag:x.lag,fe:f.filter(e=>/auto_assign|backlog|skip|no_eligible/.test(e.action)).map(e=>e.action.replace('ticket.','')+(e.summary?.reason?':'+e.summary.reason:''))};};
const waitWl=async(u,v,d=AOB,s=180)=>{const t0=Date.now();let w;for(let i=0;i<s/5;i++){w=(await wl(u,d)).dept;if(w===v)return {wl:w,sec:Math.round((Date.now()-t0)/1000)};await sleep(5000);}return {wl:w,sec:-1};};
try{
 // move case, DT2 in AO-B, move keeps the owner (owner_id given)
 if(!process.env.SKIPMV){
 const r=await rule('round_robin','mv DT2',[rrT(K+'M','sequential',[A3])],{dept:AOB,on:['create']});rids.push(r.j?.data?.id);
 const c=await counts(A3,AOB);const o=c.rec;S('DT2 mv base Open',o,JSON.stringify(c.list),'wl',c.wl);
 const X=await tk(K+'x DT2 mv extra owned',{owner:A3},AOB);closeL.push(X);const dx=await waitDesk(X);S('DT2 mv extra owned #'+dx.n,'owner',await own(X),'wl',JSON.stringify(await waitWl(A3,o+1)));
 await P({department_threshold:o+1});await sleep(2500);
 let x=await probe(K+'M full');S('DT2 mv thr',o+1,'agent at',o+1,'(expect WAIT) #'+x.n,'->',x.o,JSON.stringify(x.fe));R.rows.mvFull={thr:o+1,n:x.n,o:x.o};
 const mv=await api('POST','/desk/tickets/'+X+'/move',{department_id:DA,team_id:null,owner_id:A3});LED('ticket moved '+X+' #'+dx.n+' QA AO Dept B -> QA AS6 Dept A (owner kept) -> '+mv.s);
 S('DT2 mv move #'+dx.n+' to AS6 Dept A keeping owner',E(mv),'now',await st(X));
 S('DT2 mv AO-B wl after',JSON.stringify(await waitWl(A3,o)),'records AO-B',(await counts(A3,AOB)).rec);
 x=await probe(K+'M after move');S('DT2 mv thr',o+1,'right after move (expect ASSIGNED) #'+x.n,'->',x.o,JSON.stringify(x.fe));R.rows.mvAfter={thr:o+1,n:x.n,o:x.o,id:x.t};
 await setA(rids[rids.length-1],false);}
 // control AS6 Dept A, Test User 1
 const r2=await rule('round_robin','ctl TU1 AS6A',[rrT(K+'C','sequential',[A1])],{dept:DA,on:['create']});rids.push(r2.j?.data?.id);
 const c2=await counts(A1,DA);const o2=c2.rec;S('CTL AS6A TU1 records Open/Esc',o2,'workload',c2.wl,'not closed',c2.notClosed.length,'(diff = On Hold:',c2.notClosed.filter(s=>/On Hold/.test(s)).length,')');
 await P({department_threshold:o2},DA,PD);await sleep(2500);let y=await probe(K+'C at thr '+o2,DA);S('CTL thr',o2,'(expect WAIT) #'+y.n,'->',y.o,JSON.stringify(y.fe));R.rows.ctlWait={thr:o2,n:y.n,o:y.o};
 await P({department_threshold:o2+1},DA,PD);await sleep(2500);y=await probe(K+'C at thr '+(o2+1),DA);S('CTL thr',o2+1,'(expect ASSIGNED) #'+y.n,'->',y.o,JSON.stringify(y.fe));R.rows.ctlAssign={thr:o2+1,n:y.n,o:y.o,id:y.t};
}catch(e){S('EXC',String(e.stack||e).slice(0,400));}
finally{
 const allRules=JSON.parse(fs.readFileSync(OUT+'made.json','utf8')).rules;for(const id of [...new Set([...allRules,...rids])])if(id){try{await setA(id,false);}catch(e){}}
 const deletedIds=['#4945','#4952'];let cl=0,tot=0;const mt=JSON.parse(fs.readFileSync(OUT+'made.json','utf8')).tickets;
 for(const t of mt){try{const g=await api('GET','/modules/'+T+'/records/'+t);if(g.s!==200)continue;tot++;const o=await rec(t);if(o.status==='Closed'){cl++;continue;}if((await patch(t,{status:'Closed'})).s<300)cl++;}catch(e){}}
 R.closed=cl+'/'+tot+' existing (of '+mt.length+' created)';
 R.restore='AOB '+E(await setPrefs(PB,AOB))+' '+(JSON.stringify(await prefs(AOB))===JSON.stringify(PB))+'; DA '+E(await setPrefs(PD,DA))+' '+(JSON.stringify(await prefs(DA))===JSON.stringify(PD));
 R.rulesActive=(await listRules('round_robin',AOB)).concat(await listRules('round_robin',DA)).filter(r=>/QA RT20 PC/.test(r.name)&&r.is_active).map(r=>r.name);
 LED(TAG+': QA AO Dept B + QA AS6 Dept A RR prefs restored to the pre-test snapshot '+R.restore+'; PC tickets closed '+R.closed+'; deleted (left in Recycle Bin) #4945 #4952; PC rules active: '+JSON.stringify(R.rulesActive));try{fs.unlinkSync(LOCK);}catch(e){}}
save(TAG+'.json',R);return R;
