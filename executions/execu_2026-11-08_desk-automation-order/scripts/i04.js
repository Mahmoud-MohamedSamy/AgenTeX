// I-04 re-measure: 20 tickets, sequential RR pool A1–A3; time from create to auto-assign (ticket history). Cleans up.
eval(fs.readFileSync('lib-as.js','utf8'));const k='AOI04b'+U;const r=await rule('round_robin','I04b',[rrT(k,'sequential')]);
const ids=[];for(let i=0;i<20;i++){ids.push(await tk(k+' '+i));await sleep(500);}await sleep(20000);
const ts=[];for(const id of ids){const f=await feed(id);const c=f.find(e=>e.action==='ticket.created'),a=f.find(e=>e.action==='ticket.auto_assigned');ts.push(a?(new Date(a.occurred_at)-new Date(c.occurred_at))/1000:999);}
await setA(r.j.data.id,false);ts.sort((a,b)=>a-b);const R={within5:ts.filter(x=>x<=5).length+'/20',median:ts[10].toFixed(1),p95:ts[18].toFixed(1),max:ts[19].toFixed(1),all:ts.map(x=>x.toFixed(1)).join(' ')};
await api('DELETE','/desk/assignment-rules/'+r.j.data.id);for(const id of ids)await api('DELETE','/modules/'+T+'/records/'+id);made.tickets=[];made.rules=[];saveMade();fs.writeFileSync("../i04-"+k+".json",JSON.stringify({at:new Date().toISOString(),...R},null,1));return R;
