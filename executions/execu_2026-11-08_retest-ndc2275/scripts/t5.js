// NDC-2275 retest, part 5: threshold race repeats (counted from each ticket's own owner), then backlog first with the queue cleared.
eval(require('fs').readFileSync(require('path').join(OUT,'../scripts/lib.js'),'utf8'));
const R={};const save=()=>fs.writeFileSync(OUT+'/t5.json',JSON.stringify(R,null,1));
const p0=await getP();
const wl=async u=>{const d=(await api('GET','/desk/agents/'+u+'/workload')).j.data;return (d.departments||[]).reduce((n,x)=>n+x.open_tickets,0);};
const owners=async L=>{const o=[];for(const t of L)o.push((await own(t)).owner);return o;};const tally=a=>a.reduce((m,x)=>(m[x]=(m[x]||0)+1,m),{});
const {RULES}=JSON.parse(fs.readFileSync(OUT+'/t2-rules.json','utf8'));
try{
 for(const run of [3,4,5,6,7]){const c2=await wl(IDS.A2),c3=await wl(IDS.A3);await setP(p0,{assign_to_offline_agents:true,agent_threshold_enabled:true,department_threshold_enabled:true,department_threshold:1,agent_thresholds:[{user_id:IDS.A2,threshold:c2+5},{user_id:IDS.A3,threshold:c3+5}]});await W(1000);
  const L=await Promise.all(Array.from({length:20},(_,i)=>mk(PX+' RT15CONC r'+run+' '+(i+1),null,{owner:null})));const ids=L.filter(x=>x.id).map(x=>x.id);await W(12000);const o=await owners(ids);let mx=0;for(const id of ids){mx=Math.max(mx,(await act(id)).filter(x=>x.action==='ticket.auto_assigned').length);}
  R['conc'+run]={created:ids.length,tally:tally(o),maxEntriesPerTicket:mx,wlDelta:{A2:(await wl(IDS.A2))-c2,A3:(await wl(IDS.A3))-c3}};save();await setP(p0,{});await W(1500);}
 // Backlog first: limit raised so the older queue clears in one run
 await setP(p0,{assign_to_offline_agents:true,incoming_mode:'backlog_first',assign_backlogs:true,backlog_limit:50});LED('Dept A incoming=backlog_first, limit 50, offline allowed temporarily');
 const t=await mk(PX+' RT15SEQ backlog first 2',null,{owner:null});await W(4000);const at4=(await own(t.id)).owner;const t0=Date.now();let o='-';while(Date.now()-t0<200000&&o==='-'){await W(5000);o=(await own(t.id)).owner;}
 R.backlogFirst={no:(await own(t.id)).no,at4s:at4,finally:o,sec:Math.round((Date.now()-t0)/1000),trigger:(await act(t.id)).filter(x=>x.action==='ticket.auto_assigned').map(x=>x.summary.trigger+' / '+x.summary.rule_name)};save();
}finally{const b=await api('PUT',prefsUrl,p0);R.prefsBack=b.s;LED('Dept A prefs restored '+b.s);R.same=JSON.stringify(await getP())===JSON.stringify(JSON.parse(fs.readFileSync(OUT+'/prefs-before.json','utf8')));save();}
return 'ok';
