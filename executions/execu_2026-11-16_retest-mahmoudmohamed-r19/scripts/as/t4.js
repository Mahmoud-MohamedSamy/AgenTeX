var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/as/";eval(fs.readFileSync(__AS+'lib.js','utf8'));
const AOB='4853562a-0b4d-45cb-ba34-9f2118fcd32c';NM[AOB]='AO-B';const R={steps:[]};const S=(...a)=>{const l=a.join(' ');R.steps.push(l);log(l);};
const num=async id=>(await rec(id)).ticket_number;
const all=async()=>{const rows=[];for(let p=1;p<20;p++){const g=await api('GET','/modules/'+T+'/records?page='+p+'&per_page=100');const L=g.j?.data?.items||g.j?.data||[];for(const r of L){const o={};for(const x of r.data||[]){o[x.field]=x.value?.value;}rows.push(o);}if(!g.j?.meta?.more_records)break;}return rows;};
const openCnt=async(u,d)=>{const rows=await all();const L=rows.filter(r=>r.owner===u&&r.department===d);return {Open:L.filter(r=>r.status==='Open').length,OnHold:L.filter(r=>r.status==='On Hold').length,Esc:L.filter(r=>r.status==='Escalated').length};};
const K='R19AS4'+U;const rules=[];const orig={};
const P=(d,o)=>setPrefs({...orig[d],assign_to_offline_agents:true,department_threshold_enabled:false,agent_threshold_enabled:false,assign_backlogs:false,assign_on_closure:false,...o},d);
const pr=async(key,l,d)=>{await sleep(2500);const t=await tk(K+key+' '+l,{},d);const o=await waitOwn(t,18);const n=await num(t);await patch(t,{status:'Closed'});await sleep(2500);return '#'+n+' -> '+o;};
try{
 orig[DA]=await prefs(DA);orig[AOB]=await prefs(AOB);save('t4-prefs-orig.json',orig);
 // T-a: A1 in QA AS6 Dept A (dev's NF-3 burst dept, tickets deleted afterwards)
 let r=await rule('round_robin','t4 A1 DA',[rrT(K+'a','sequential',[A1])],{dept:DA});rules.push(r.j?.data?.id);
 let c=await openCnt(A1,DA);S('T-a A1 in AS6 Dept A records:',JSON.stringify(c));
 await P(DA,{department_threshold_enabled:true,department_threshold:c.Open});S('T-a dept thr',c.Open,'(= Open) ->',await pr('a','thr'+c.Open,DA));
 await P(DA,{department_threshold_enabled:true,department_threshold:c.Open+1});S('T-a dept thr',c.Open+1,'(= Open+1) ->',await pr('a','thr'+(c.Open+1),DA));
 await P(DA,{department_threshold_enabled:true,department_threshold:c.Open+3});S('T-a dept thr',c.Open+3,'(= Open+3) ->',await pr('a','thr'+(c.Open+3),DA));
 await setPrefs(orig[DA],DA);
 // T-c: agent threshold for A3 in AO-B
 r=await rule('round_robin','t4 A3 AOB',[rrT(K+'c','sequential',[A3])],{dept:AOB});rules.push(r.j?.data?.id);
 c=await openCnt(A3,AOB);S('T-c A3 in AO-B records:',JSON.stringify(c));
 await P(AOB,{agent_threshold_enabled:true,agent_thresholds:[{user_id:A3,threshold:c.Open}]});S('T-c agent thr',c.Open,'(= Open, On Hold excluded) ->',await pr('c','agthr'+c.Open,AOB));
 await P(AOB,{agent_threshold_enabled:true,agent_thresholds:[{user_id:A3,threshold:c.Open+1}]});S('T-c agent thr',c.Open+1,'->',await pr('c','agthr'+(c.Open+1),AOB));
 // T-b: auto-assigned ticket deleted -> does the count drop?
 await P(AOB,{department_threshold_enabled:true,department_threshold:c.Open+2});
 const x=await tk(K+'c del-after-assign',{},AOB);const ox=await waitOwn(x,18);S('T-b ticket #'+(await num(x)),'auto-assigned ->',ox,'records now',JSON.stringify(await openCnt(A3,AOB)));
 S('T-b dept thr',c.Open+2,'with it open ->',await pr('c','b1thr'+(c.Open+2),AOB),'(expect none: Open+1 = thr-1? no: count Open+1 < thr -> A3)');
 const dl=await api('DELETE','/modules/'+T+'/records/'+x);LED('ticket '+x+' deleted (Recycle Bin) for t4 auto-assigned delete check -> '+dl.s);await sleep(3000);
 S('T-b deleted',dl.s,'records now',JSON.stringify(await openCnt(A3,AOB)));
 await P(AOB,{department_threshold_enabled:true,department_threshold:c.Open+1});S('T-b dept thr',c.Open+1,'after delete ->',await pr('c','b2thr'+(c.Open+1),AOB),'(expect A3 if delete clears count)');
 // T-d: delete immediately after create (race with assignment)
 const y=await tk(K+'c del-immediately',{},AOB);const dy=await api('DELETE','/modules/'+T+'/records/'+y);LED('ticket '+y+' deleted right after create for t4 -> '+dy.s);await sleep(5000);
 S('T-d created + deleted at once',dy.s,'records',JSON.stringify(await openCnt(A3,AOB)));
 S('T-d dept thr',c.Open+1,'->',await pr('c','d2thr'+(c.Open+1),AOB),'(expect A3)');
}finally{for(const id of rules)if(id)await setA(id,false);for(const d of [DA,AOB]){if(orig[d]){const e=E(await setPrefs(orig[d],d));R['restore'+nm(d)]=e+' '+(JSON.stringify(await prefs(d))===JSON.stringify(orig[d]));}}LED('t4: prefs QA AS6 Dept A + QA AO Dept B changed and restored '+JSON.stringify(R));}
save('t4.json',R);return R;
