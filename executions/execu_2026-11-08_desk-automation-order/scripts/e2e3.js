// E2E-3: A1 offline → A2, A3; all offline → backlog; A1 back with Assign backlogs on → backlog to A1.
eval(fs.readFileSync('lib-as.js','utf8'));const R={};const P0=await prefs();const k='AOE2E3'+U;
const r=await rule('round_robin','E2E3',[rrT(k,'sequential')]);
try{
 setP('A1','off');await sleep(30000);R.p1=await presence();const o=[];for(let i=1;i<=3;i++){const t=await tk(k+' a'+i);o.push(await waitOwn(t,16));}R.a1Offline=o.join(',');
 setP('A2','off');setP('A3','off');await sleep(30000);R.p2=await presence();const b=await tk(k+' backlog');await sleep(12000);R.allOffline=await own(b);
 await setPrefs({...P0,assign_backlogs:true,backlog_limit:5,backlog_order:'created_time'});setP('A1','on');const t0=Date.now();R.backlogNow=await waitOwn(b,120);R.after=Math.round((Date.now()-t0)/1000)+' s';
 R.trigger=(await feed(b)).find(e=>e.action==='ticket.auto_assigned')?.summary?.trigger;
}finally{setP('A1','on');setP('A2','on');setP('A3','on');R.off=await setA(r.j.data.id,false);R.prefs=E(await setPrefs(P0));}
return R;
