// F-08 vs Zoho doc: "Assign ticket on closure" → backlog ticket goes to the closed ticket's OWNER if online and under threshold; only tickets created after the option is on.
// MODE=setup: prefs (closure on, backlogs off, threshold = A1 open count after first), rule pool A1, first ticket → A1, backlog ticket waits. MODE=check: poll backlog owner, restore.
eval(fs.readFileSync('lib-as.js','utf8'));const R={};const F='../f8z.json';
if(process.env.MODE==='setup'){const P0=await prefs();fs.writeFileSync('../f8z-p0.json',JSON.stringify(P0));
 await setPrefs({...P0,assign_on_closure:true,assign_backlogs:false,department_threshold_enabled:false});await sleep(3000);
 const k='AOF8z'+U;const r=await rule('round_robin','F8z',[rrT(k,'sequential',[A1])]);const first=await tk(k+' first');R.first=await waitOwn(first,20);
 const a1=(await wl(A1)).all;R.threshold=a1;R.prefs=E(await setPrefs({...P0,assign_on_closure:true,assign_backlogs:false,department_threshold_enabled:true,department_threshold:Math.min(200,a1)}));
 await sleep(3000);const back=await tk(k+' backlog');await sleep(15000);R.backlog=await own(back);R.presence=await presence();
 fs.writeFileSync(F,JSON.stringify({first,back,rule:r.j.data.id}));return R;}
const j=JSON.parse(fs.readFileSync(F,'utf8'));R.a1=(await wl(A1)).all;R.thr=(await prefs()).department_threshold;R.presence=await presence();
R.firstStatus=(await rec(j.first)).status;const t0=Date.now();R.backlog=await waitOwn(j.back,90);R.after=Math.round((Date.now()-t0)/1000)+' s';
R.trigger=(await feed(j.back)).find(e=>e.action==='ticket.auto_assigned')?.summary?.trigger||null;
R.off=await setA(j.rule,false);R.restore=E(await setPrefs(JSON.parse(fs.readFileSync('../f8z-p0.json','utf8'))));return R;
