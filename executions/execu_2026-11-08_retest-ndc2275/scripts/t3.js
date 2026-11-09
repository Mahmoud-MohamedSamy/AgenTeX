// NDC-2275 retest, part 3: who turned the master switch off; thresholds, 20 concurrent creates, backlog, closure, incoming mode.
eval(require('fs').readFileSync(require('path').join(OUT,'../scripts/lib.js'),'utf8'));
const R={};const save=()=>fs.writeFileSync(OUT+'/t3.json',JSON.stringify(R,null,1));
const cs=async(k,fn)=>{try{R[k]=await fn();}catch(e){R[k]={ERR:String(e.message).slice(0,300)};if(/STOP 429|SIGNED_OUT/.test(e.message))throw e;}save();};
const p0=await getP();
const wl=async u=>{const d=(await api('GET','/desk/agents/'+u+'/workload')).j.data;return (d.departments||[]).reduce((n,x)=>n+x.open_tickets,0);};
const owners=async L=>{const o=[];for(const t of L)o.push((await own(t.id||t)).owner);return o;};
const tally=a=>a.reduce((m,x)=>(m[x]=(m[x]||0)+1,m),{});
await cs('A who changed DirectRulesEnabled today',async()=>{let cur='',hits=[];for(let i=0;i<45;i++){const r=await api('GET','/audit/events?limit=100'+(cur?'&cursor='+encodeURIComponent(cur):''));if(r.s!==200)break;const L=arr(r.j.data);for(const x of L){const c=JSON.stringify(x.changes||[]);if(/DirectRulesEnabled/.test(c)){const f=(x.changes||[]).find(y=>y.field==='DirectRulesEnabled');hits.push({t:String(x.occurred_at).slice(0,19),who:x.actor_label||x.actor_id,ch:x.source_channel,from:f.old_value,to:f.new_value});}}const l=L[L.length-1];if(!l||String(l.occurred_at)<'2026-11-08T00:00')break;cur=r.j.meta&&r.j.meta.next_cursor;if(!cur)break;await W(200);}return hits;});
let tk=[];
try{
 await pres({a2:'on',a3:'on'});await W(2000);
 const conc=await mkRule(RR('conc','RT15CONC','sequential',[IDS.A2,IDS.A3]));
 const c2=await wl(IDS.A2),c3=await wl(IDS.A3);R.counts={A2:c2,A3:c3};
 // NF-3 on create
 await cs('B 20 creates at once, each agent +5 allowed',async()=>{await setP(p0,{agent_threshold_enabled:true,department_threshold_enabled:true,department_threshold:1,agent_thresholds:[{user_id:IDS.A2,threshold:c2+5},{user_id:IDS.A3,threshold:c3+5}]});LED('Dept A thresholds ON temporarily');
  const L=await Promise.all(Array.from({length:20},(_,i)=>mk(PX+' RT15CONC '+(i+1),null,{owner:null})));tk=L.filter(x=>x.id).map(x=>x.id);await W(12000);const o=await owners(tk);const entries=[];for(const id of tk)entries.push((await act(id)).filter(x=>x.action==='ticket.auto_assigned').length);return{created:L.filter(x=>x.s===201).length,tally:tally(o),maxEntries:Math.max(...entries),workload:{A2:await wl(IDS.A2),A3:await wl(IDS.A3)}};});
 fs.writeFileSync(OUT+'/t3-conc.json',JSON.stringify(tk));
 // both off: stays
 await cs('C both backlog options off: waits 20 s',async()=>{await W(20000);return tally(await owners(tk));});
 // Assign backlogs
 await cs('D Assign backlogs ON, A2 threshold +1: assigned within 1 min?',async()=>{const b=await owners(tk);const a2=await wl(IDS.A2);await setP(p0,{agent_threshold_enabled:true,department_threshold_enabled:true,department_threshold:1,agent_thresholds:[{user_id:IDS.A2,threshold:a2+1},{user_id:IDS.A3,threshold:(await wl(IDS.A3))}],assign_backlogs:true,backlog_limit:10,backlog_order:'created_time'});const t0=Date.now();let got=null;const w0=a2;while(Date.now()-t0<130000){await W(5000);const w=await wl(IDS.A2);if(w>w0){got={sec:Math.round((Date.now()-t0)/1000),workload:w};break;}}const a=await owners(tk);return{got,mineNowAssigned:tally(a),changed:tk.filter((_,i)=>a[i]!==b[i]).length};});
 // closure
 await cs('E Assign on closure: A3 closes one, next backlog ticket to A3 at once',async()=>{const a3=await wl(IDS.A3);await setP(p0,{agent_threshold_enabled:true,department_threshold_enabled:true,department_threshold:1,agent_thresholds:[{user_id:IDS.A2,threshold:await wl(IDS.A2)},{user_id:IDS.A3,threshold:a3}],assign_backlogs:false,assign_on_closure:true});const b=await owners(tk);const idx=b.indexOf('A3');const id=tk[idx];const c=await as('a3','PATCH','/modules/'+T+'/records/'+id,body({status:'Closed'}));const t0=Date.now();let sec=null;while(Date.now()-t0<30000){await W(1500);const w=await wl(IDS.A3);if(w>=a3){sec=Math.round((Date.now()-t0)/100)/10;break;}}const a=await owners(tk);return{closed:(await own(id)).no,patch:c.s,secToRefill:sec,workload:{before:a3,after:await wl(IDS.A3)},mineTakenByA3:tk.filter((_,i)=>a[i]==='A3'&&b[i]!=='A3').length};});
 // both off after a close
 await cs('F both off: A3 closes one, nothing assigned',async()=>{await setP(p0,{agent_threshold_enabled:true,department_threshold_enabled:true,department_threshold:1,agent_thresholds:[{user_id:IDS.A2,threshold:await wl(IDS.A2)},{user_id:IDS.A3,threshold:await wl(IDS.A3)}],assign_backlogs:false,assign_on_closure:false});const b=await owners(tk);const id=tk[b.indexOf('A3')];const w=await wl(IDS.A3);await as('a3','PATCH','/modules/'+T+'/records/'+id,body({status:'Closed'}));await W(15000);const a=await owners(tk);return{before:w,after:await wl(IDS.A3),mineChanged:tk.filter((_,i)=>a[i]!==b[i]&&tk[i]!==id).length};});
 // agent threshold switch off, row kept: dept threshold 1 applies -> backlog; dept off -> assigned
 await cs('G agent threshold off, row kept, dept threshold 1: over threshold, waits',async()=>{const P1={agent_threshold_enabled:false,department_threshold_enabled:true,department_threshold:1,agent_thresholds:[{user_id:IDS.A2,threshold:200}],assign_backlogs:false,assign_on_closure:false};await setP(p0,P1);const g=await getP();const t=await mk(PX+' RT15CONC agent off',null,{owner:null});await W(4000);return{owner:(await own(t.id)).owner,rowKept:g.agent_thresholds};});
 await cs('H agent threshold on again (A2=200): overrides dept threshold',async()=>{await setP(p0,{agent_threshold_enabled:true,department_threshold_enabled:true,department_threshold:1,agent_thresholds:[{user_id:IDS.A2,threshold:200}],assign_backlogs:false});const s=[];for(let i=0;i<3;i++){const t=await mk(PX+' RT15CONC agent on '+i,null,{owner:null});await W(3000);s.push((await own(t.id)).owner);}return s;});
 // incoming backlog first
 await cs('I incoming = backlog first: unassigned at create, assigned by the run',async()=>{await setP(p0,{incoming_mode:'backlog_first',assign_backlogs:true,backlog_limit:1,department_threshold_enabled:false,agent_threshold_enabled:false});const t=await mk(PX+' RT15SEQ backlog first',null,{owner:null});await W(4000);const at4=(await own(t.id)).owner;const t0=Date.now();let o='-';while(Date.now()-t0<150000&&o==='-'){await W(5000);o=(await own(t.id)).owner;}const tr=(await act(t.id)).filter(x=>x.action==='ticket.auto_assigned').map(x=>x.summary.trigger);return{at4s:at4,finally:o,sec:Math.round((Date.now()-t0)/1000),trigger:tr};});
}finally{
 const pb=await api('PUT',prefsUrl,p0);R.prefsBack=pb.s;LED('Dept A prefs restored '+pb.s);R.prefsNow=await getP();save();
}
return 'ok';
