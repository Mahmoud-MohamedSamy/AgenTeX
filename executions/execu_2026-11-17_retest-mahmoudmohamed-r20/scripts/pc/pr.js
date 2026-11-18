eval(fs.readFileSync("D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/scripts/pc/hdr.js",'utf8'));
// NDC-3076 retest: threshold = real Open count (x2 per agent), delete / restore / move cases, AS6 Dept A control.
const LOCK=RUN+'/locks/qa-ao-dept-b-and-as6a-rr-prefs.lock';if(fs.existsSync(LOCK))return {err:'lock exists'};fs.writeFileSync(LOCK,'PC lane NDC-3076 '+new Date().toISOString());
const TAG='pr';const R={at:new Date().toISOString(),steps:[],rows:{}};const S=(...a)=>{const l=new Date().toISOString().slice(11,19)+' '+a.join(' ');R.steps.push(l);save(TAG+'.json',R);};
const PB=await prefs(AOB),PD=await prefs(DA);save(TAG+'-prefs-orig.json',{AOB:PB,DA:PD});
const P=(o,d=AOB,base=PB)=>setPrefs({...base,assign_to_offline_agents:true,department_threshold_enabled:true,agent_threshold_enabled:false,assign_backlogs:false,assign_on_closure:false,...o},d);
const K='PC'+U;let rids=[];const closeL=[];const deleted=[];
const probe=async(key,dept=AOB)=>{const t=await tk(key,{},dept);const x=await waitRR(t,90);const f=await feed(t);closeL.push(t);return {t,n:x.n,o:x.o,lag:x.lag,fe:f.filter(e=>/auto_assign|backlog|skip|no_eligible/.test(e.action)).map(e=>e.action.replace('ticket.','')+(e.summary?.reason?':'+e.summary.reason:''))};};
const cnt=async(u,d=AOB)=>{const c=await counts(u,d);return c;};
// wait until workload count equals v (Desk event applied)
const waitWl=async(u,v,d=AOB,s=180)=>{const t0=Date.now();let w;for(let i=0;i<s/5;i++){w=(await wl(u,d)).dept;if(w===v)return {wl:w,sec:Math.round((Date.now()-t0)/1000)};await sleep(5000);}return {wl:w,sec:-1};};
const closeT=async(t)=>E(await patch(t,{status:'Closed'}));
const binFind=async(id)=>{let cur=null;for(let p=0;p<10;p++){const r=await api('GET','/audit/recycle-bin/items?app_key=desk&limit=200'+(cur?'&cursor='+encodeURIComponent(cur):''));const L=arr(r.j?.data?.items||r.j?.data);const it=L.find(x=>x.record_id===id||JSON.stringify(x).includes(id));if(it)return it;cur=r.j?.meta?.next_cursor||r.j?.meta?.nextCursor;if(!cur)break;}return null;};
const ONLY=(process.env.ONLY||'thr,del,rst,mv,ctl').split(',');
try{
 for(const [n,u] of [['TU1',A1],['DT2',A3]]){
  const r=await rule('round_robin','thr '+n,[rrT(K+n,'sequential',[u])],{dept:AOB,on:['create']});rids.push(r.j?.data?.id);S(n,'rule',E(r));
  if(ONLY.includes('thr'))for(let rep=1;rep<=2;rep++){
   const c=await cnt(u);S(n,'rep',rep,'records Open/Esc',c.rec,JSON.stringify(c.list),'workload',c.wl);const o=c.rec;
   await P({department_threshold:o});await sleep(2500);
   let x=await probe(K+n+' r'+rep+' at thr '+o);S(n,'rep',rep,'thr',o,'(=count, expect WAIT) #'+x.n,'->',x.o,JSON.stringify(x.fe),'desk lag',x.lag);R.rows[n+'-r'+rep+'-wait']={thr:o,n:x.n,o:x.o};
   await P({department_threshold:o+1});await sleep(2500);
   x=await probe(K+n+' r'+rep+' at thr '+(o+1));S(n,'rep',rep,'thr',o+1,'(=count+1, expect ASSIGNED) #'+x.n,'->',x.o,JSON.stringify(x.fe));R.rows[n+'-r'+rep+'-assign']={thr:o+1,n:x.n,o:x.o,id:x.t};
   if(x.o!=='none'){S(n,'close #'+x.n,await closeT(x.t),'wl back',JSON.stringify(await waitWl(u,o)));}
  }
  if(ONLY.includes('del')||(n==='DT2'&&(ONLY.includes('rst')||ONLY.includes('mv')))){
   const cases=n==='DT2'?['del','rst','mv']:['del'];
   for(const cs of cases){if(!ONLY.includes(cs))continue;
    const c=await cnt(u);const o=c.rec;S(n,cs,'base Open',o,'wl',c.wl);
    const X=await tk(K+'x '+n+' '+cs+' extra owned',{owner:u},AOB);closeL.push(X);const dx=await waitDesk(X);S(n,cs,'extra owned ticket #'+dx.n,'owner',await own(X),'wl now',JSON.stringify(await waitWl(u,o+1)),'records',(await cnt(u)).rec);
    await P({department_threshold:o+1});await sleep(2500);
    let x=await probe(K+n+' '+cs+' full');S(n,cs,'thr',o+1,'agent at',o+1,'(expect WAIT) #'+x.n,'->',x.o,JSON.stringify(x.fe));R.rows[n+'-'+cs+'-full']={thr:o+1,n:x.n,o:x.o};
    if(cs==='mv'){S(n,'mv','move #'+dx.n+' to AS6 Dept A',E(await patch(X,{department:DA})));}
    else{const d=await api('DELETE','/modules/'+T+'/records/'+X);deleted.push({id:X,n:dx.n});LED('ticket deleted '+X+' #'+dx.n+' ('+cs+' case) -> '+d.s);S(n,cs,'DELETE #'+dx.n,E(d),'GET record after',(await api('GET','/modules/'+T+'/records/'+X)).s,'GET desk ticket after',(await api('GET','/desk/tickets/'+X)).s);}
    S(n,cs,'wl after',JSON.stringify(await waitWl(u,o)),'records',(await cnt(u)).rec);
    x=await probe(K+n+' '+cs+' after');S(n,cs,'thr',o+1,'right after '+cs+' (expect ASSIGNED) #'+x.n,'->',x.o,JSON.stringify(x.fe));R.rows[n+'-'+cs+'-after']={thr:o+1,n:x.n,o:x.o,id:x.t};
    if(x.o!=='none'){S(n,cs,'close #'+x.n,await closeT(x.t),'wl back',JSON.stringify(await waitWl(u,o)));}
    if(cs==='rst'){
     const it=await binFind(X);S(n,'rst','bin item',it?'found':'NOT FOUND');
     if(it){const rs=await api('POST','/audit/recycle-bin/restore',{ids:[it.id]});LED('ticket restored from Recycle Bin '+X+' #'+dx.n+' -> '+rs.s);deleted.pop();S(n,'rst','restore',E(rs),'record GET',(await api('GET','/modules/'+T+'/records/'+X)).s,'owner',await own(X).catch(()=>'?'),'status',(await rec(X)).status);
      S(n,'rst','wl after restore',JSON.stringify(await waitWl(u,o+1)),'records',(await cnt(u)).rec);
      x=await probe(K+n+' rst after restore');S(n,'rst','thr',o+1,'after restore (agent back at',o+1,', expect WAIT) #'+x.n,'->',x.o,JSON.stringify(x.fe));R.rows[n+'-rst-restored']={thr:o+1,n:x.n,o:x.o};
      S(n,'rst','close restored #'+dx.n,await closeT(X),'wl',JSON.stringify(await waitWl(u,o)));}
    }
    if(cs==='mv'){S(n,'mv','close moved #'+dx.n,await closeT(X));}
   }
  }
  await setA(rids[rids.length-1],false);
 }
 if(ONLY.includes('ctl')){ // control AS6 Dept A, TU1
  const r=await rule('round_robin','ctl TU1 AS6A',[rrT(K+'C','sequential',[A1])],{dept:DA,on:['create']});rids.push(r.j?.data?.id);
  for(let rep=1;rep<=1;rep++){const c=await cnt(A1,DA);const o=c.rec;S('CTL AS6A TU1 records Open/Esc',o,'workload',c.wl,'notClosed',c.notClosed.length);
   await P({department_threshold:o},DA,PD);await sleep(2500);let x=await probe(K+'C at thr '+o,DA);S('CTL thr',o,'(expect WAIT) #'+x.n,'->',x.o,JSON.stringify(x.fe));R.rows['ctl-wait']={thr:o,n:x.n,o:x.o};
   await P({department_threshold:o+1},DA,PD);await sleep(2500);x=await probe(K+'C at thr '+(o+1),DA);S('CTL thr',o+1,'(expect ASSIGNED) #'+x.n,'->',x.o,JSON.stringify(x.fe));R.rows['ctl-assign']={thr:o+1,n:x.n,o:x.o,id:x.t};}
 }
}catch(e){S('EXC',String(e.stack||e).slice(0,400));}
finally{for(const id of rids)if(id)await setA(id,false);let cl=0;for(const t of closeL){if(deleted.find(d=>d.id===t))continue;const s=(await patch(t,{status:'Closed'})).s;if(s<300)cl++;}R.closed=cl+'/'+closeL.length;R.deleted=deleted;
 R.restore='AOB '+E(await setPrefs(PB,AOB))+' '+(JSON.stringify(await prefs(AOB))===JSON.stringify(PB))+'; DA '+E(await setPrefs(PD,DA))+' '+(JSON.stringify(await prefs(DA))===JSON.stringify(PD));
 LED(TAG+': QA AO Dept B + QA AS6 Dept A RR prefs changed and restored '+R.restore+'; probe tickets closed '+R.closed+'; deleted (left in Recycle Bin) '+JSON.stringify(deleted.map(d=>'#'+d.n)));try{fs.unlinkSync(LOCK);}catch(e){}}
save(TAG+'.json',R);return R;
