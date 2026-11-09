// NDC-2275 retest, part 4: repeat NF-3 twice with clean counts; identify tickets taken by backlog/closure; size of the backlog queue.
eval(require('fs').readFileSync(require('path').join(OUT,'../scripts/lib.js'),'utf8'));
const R={};const save=()=>fs.writeFileSync(OUT+'/t4.json',JSON.stringify(R,null,1));
const p0=await getP();
const wl=async u=>{const d=(await api('GET','/desk/agents/'+u+'/workload')).j.data;return (d.departments||[]).reduce((n,x)=>n+x.open_tickets,0);};
const owners=async L=>{const o=[];for(const t of L)o.push((await own(t)).owner);return o;};const tally=a=>a.reduce((m,x)=>(m[x]=(m[x]||0)+1,m),{});
// who was given what by the backlog/closure steps
const lastN=async who=>{const r=await as(who,'GET','/notifications?limit=30');const d=r.j&&r.j.data;const L=Array.isArray(d)?d:(d&&d.data)||[];return L.filter(n=>n.event_type==='desk.ticket.assigned').slice(0,12).map(n=>String(n.created_at||n.occurred_at||'').slice(11,19)+' '+String(n.title).slice(0,70));};
R.a2recent=await lastN('a2');save();
const au=await api('GET','/audit/events?limit=100');R.a3actor=arr(au.j.data).filter(x=>x.actor_id===IDS.A3).slice(0,5).map(x=>({t:String(x.occurred_at).slice(0,19),a:x.action,tg:x.target_type,l:String(x.target_label).slice(0,40),ua:String(x.source_user_agent||'').slice(0,40)}));save();
// queue
let un={};let tot=0;const old=[];for(let pg=1;pg<=40;pg++){const r=await api('GET','/modules/'+T+'/records?page='+pg+'&page_size=100');const L=arr(r.j&&r.j.data);if(!L.length)break;for(const x of L){const o=fl(x);tot++;if(o.status==='Closed')continue;if((o.department===IDS.DA||o.department===IDS.DB)&&!o.owner&&!o.team){const k=o.department===IDS.DA?'DA':'DB';un[k]=(un[k]||0)+1;if(k==='DA'&&old.length<6)old.push(o.ticket_number+' '+String(o.subject).slice(0,40));}}if(L.length<100)break;await W(150);}
R.queue={tickets:tot,unassignedOpen:un,sampleDA:old};save();
try{
 for(const run of [1,2]){const c2=await wl(IDS.A2),c3=await wl(IDS.A3);await setP(p0,{assign_to_offline_agents:true,agent_threshold_enabled:true,department_threshold_enabled:true,department_threshold:1,agent_thresholds:[{user_id:IDS.A2,threshold:c2+5},{user_id:IDS.A3,threshold:c3+5}]});await W(1000);
  const L=await Promise.all(Array.from({length:20},(_,i)=>mk(PX+' RT15CONC r'+run+' '+(i+1),null,{owner:null})));const ids=L.filter(x=>x.id).map(x=>x.id);await W(15000);const o=await owners(ids);let mx=0;for(const id of ids){mx=Math.max(mx,(await act(id)).filter(x=>x.action==='ticket.auto_assigned').length);}
  R['conc'+run]={before:{A2:c2,A3:c3},allowed:{A2:c2+5,A3:c3+5},after:{A2:await wl(IDS.A2),A3:await wl(IDS.A3)},tally:tally(o),maxEntriesPerTicket:mx};save();await setP(p0,{});await W(2000);}
}finally{const b=await api('PUT',prefsUrl,p0);R.prefsBack=b.s;LED('Dept A prefs restored '+b.s);save();}
return 'ok';
