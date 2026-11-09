// Clean redo: assign on closure, and both options off. Known backlog ticket; a fresh open ticket closed each time, closed by A2.
eval(require('fs').readFileSync(require('path').join(OUT,'../scripts/lib.js'),'utf8'));
const R={};const save=()=>fs.writeFileSync(OUT+'/t12.json',JSON.stringify(R,null,1));const p0=await getP();
const wl=async u=>{const d=(await api('GET','/desk/agents/'+u+'/workload')).j.data;return (d.departments||[]).reduce((n,x)=>n+x.open_tickets,0);};
const FULL=async(extra)=>{const a=await wl(IDS.A2);await setP(p0,{department_threshold_enabled:true,department_threshold:1,agent_threshold_enabled:true,agent_thresholds:[{user_id:IDS.A2,threshold:a}],assign_backlogs:false,assign_on_closure:false,...extra});return a;};
const unas=async()=>{let n=0,L2=[];for(let pg=1;pg<=8;pg++){const r=await api('GET','/modules/'+T+'/records?page='+pg+'&page_size=100');const L=arr(r.j&&r.j.data);for(const x of L){const o=fl(x);if(o.department===IDS.DA&&!o.owner&&!o.team&&o.status!=='Closed'){n++;if(L2.length<5)L2.push(o.ticket_number);}}if(L.length<100)break;await W(120);}return{n,sample:L2};};
try{
 await pres({a2:'on'});await W(2000);
 R.queueBefore=await unas();save();
 // two tickets for A2 to close (preset owner, so no rule involved)
 const X=await mk(PX+' close X',null,{owner:IDS.A2});const Y=await mk(PX+' close Y',null,{owner:IDS.A2});await W(1500);
 // E: on closure
 let a=await FULL({assign_on_closure:true});const T1=await mk(PX+' RT15SEQ closure wait 1',null,{owner:null});await W(4000);
 R.E={thresholdA2:a,waitingBefore:(await own(T1.id)).owner};
 const c=await as('a2','PATCH','/modules/'+T+'/records/'+X.id,body({status:'Closed'}));const t0=Date.now();let o='-';while(Date.now()-t0<30000&&o==='-'){await W(400);o=(await own(T1.id)).owner;}
 R.E={...R.E,no:(await own(T1.id)).no,closed:(await own(X.id)).no,patch:c.s,owner:o,sec:Math.round((Date.now()-t0)/100)/10,trigger:(await act(T1.id)).filter(x=>x.action==='ticket.auto_assigned').map(x=>x.summary.trigger+' / '+x.summary.rule_name),wlAfter:await wl(IDS.A2)};save();
 // F: both off
 a=await FULL({});const T2=await mk(PX+' RT15SEQ closure wait 2',null,{owner:null});await W(4000);const w0=await wl(IDS.A2);
 const c2=await as('a2','PATCH','/modules/'+T+'/records/'+Y.id,body({status:'Closed'}));await W(20000);
 R.F={thresholdA2:a,no:(await own(T2.id)).no,closed:(await own(Y.id)).no,patch:c2.s,owner:(await own(T2.id)).owner,wlBefore:w0,wlAfter:await wl(IDS.A2)};save();
 R.queueAfter=await unas();save();
}finally{const b=await api('PUT',prefsUrl,p0);R.prefsBack=b.s;LED('Dept A prefs restored '+b.s);R.same=JSON.stringify(await getP())===JSON.stringify(JSON.parse(fs.readFileSync(OUT+'/prefs-before.json','utf8')));save();}
return 'ok';
