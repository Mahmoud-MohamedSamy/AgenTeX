var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/scripts/as/";eval(fs.readFileSync(__AS+'lib.js','utf8'));
// Control: QA AS6 Dept A (thresholds off, offline allowed - unchanged), plain sequential rule A1+A3, one ticket, watch 3 min.
const R={steps:[],prefs:await prefs(DA)};const S=(...a)=>{R.steps.push(a.join(' '));save('ctl.json',R);};
const K='R20CTL'+U;const r=await rule('round_robin','control seq',[rrT(K,'sequential',[A1,A3])],{on:['create','update']});const rid=r.j?.data?.id;S('rule',E(r));await sleep(5000);
try{const t=await tk(K+' control');const d=await waitDesk(t);S('ticket #'+d.n,'lag',d.lag);
 for(let i=0;i<12;i++){await sleep(15000);const o=await own(t);const f=(await feed(t)).map(e=>e.action.replace('ticket.',''));S('t+'+(i+1)*15+'s',o,JSON.stringify(f));if(o!=='none')break;}
 R.t=t;
 // also try an update trigger
 const p=await patch(t,{priority:'low'});await sleep(30000);S('after update',E(p),await own(t),JSON.stringify((await feed(t)).map(e=>e.action.replace('ticket.',''))));
 await patch(t,{status:'Closed'});
}finally{await setA(rid,false);}
return R;
