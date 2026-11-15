// OR-27: 100 tickets into QA AS6 Dept A with a sequential round-robin rule; time from ticket.created to the round-robin owner (from history timestamps).
eval(fs.readFileSync('lib-as.js','utf8'));eval(fs.readFileSync('lib-pb.js','utf8'));
const R={};const k='PC27'+U;R.presence=await presence();const rr=await prule('round_robin','PC27 rr',[rrT(k,'sequential')],{on:['create']});
const ids=[];const t0=Date.now();const P=[];for(let i=0;i<100;i++){P.push(ptk(k+' '+i).then(id=>ids.push(id)).catch(e=>R.err=(R.err||0)+1));await sleep(+process.env.GAP||300);}await Promise.all(P);R.createSecs=((Date.now()-t0)/1000).toFixed(1);R.made=ids.length;
await sleep(30000);const d=[];const by={};let none=0;
for(const id of ids){const f=await feed(id);const c=f.find(e=>e.action==='ticket.created');const a=f.find(e=>e.action==='ticket.auto_assigned'&&e.summary?.owner_id);if(!a){none++;continue;}d.push((new Date(a.occurred_at)-new Date(c.occurred_at))/1000);by[nm(a.summary.owner_id)]=(by[nm(a.summary.owner_id)]||0)+1;}
d.sort((a,b)=>a-b);R.assigned=d.length;R.unassigned=none;R.within5s=d.filter(x=>x<=5).length;R.median=d[Math.floor(d.length/2)];R.p95=d[Math.floor(d.length*0.95)];R.max=d[d.length-1];R.byAgent=by;
try{await setA(rr.id,false);}catch(e){}fs.writeFileSync('../pc2-'+(process.env.GAP||300)+'-result.json',JSON.stringify(R,null,1));return R;
