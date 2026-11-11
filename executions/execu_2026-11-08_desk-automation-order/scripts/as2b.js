// Batch 2: C-04 redo, D-04, D-07, D-12 (direct switch on, then back off in finally — user OK 10 Nov), E-05, E-10, E-11, E-12, E-16, E-19.
eval(fs.readFileSync('lib-as.js','utf8'));const R={};const cs=async(id,fn)=>{try{R[id]=await fn();}catch(e){R[id]='ERR '+e.message.slice(0,150);}};
const QT1='e82f62cb-9904-42c7-a13c-77a7449820b9';
const orig=await notif();R.directSwitchBefore=orig.direct_rules_enabled;
try{
 await cs('D-12a rule active, master switch OFF → nothing',async()=>{const k='AOD12'+U;const r=await rule('direct','D12',[daT(k,ag(A1))]);const t=await tk(k+' a');await sleep(4000);const o=await own(t);await setA(r.j.data.id,false);R._d12=r.j.data.id;return o;});
 R.switchOn=(await api('PUT','/desk/assignment/notification-settings',{...orig,direct_rules_enabled:true})).s;
 await cs('D-12b rule inactive, master ON → nothing',async()=>{const t=await tk('AOD12'+U+' b');await sleep(4000);return await own(t);});
 await cs('D-07 move to AS6-A unassigned, AS6-A RR matches → same event',async()=>{const k='AOD07'+U;const rr=await rule('round_robin','D07rr',[rrT(k,'sequential')],{on:['create','update']});
  const d=await rule('direct','D07',[daT(k,{kind:'unassigned',user_id:null,team_id:null},{coming:null,move:DA})]);const t=await tk(k,{},DB);await sleep(6000);const s=await st(t);const f=(await feed(t)).map(e=>e.action+(e.summary?.trigger?'('+e.summary.trigger+')':'')).join(',');await setA(rr.j.data.id,false);await setA(d.j.data.id,false);return s+' | '+f;});
}finally{R.switchRestore=(await api('PUT','/desk/assignment/notification-settings',orig)).s;R.switchAfter=(await notif()).direct_rules_enabled;}
await sleep(5000);R.presence=await presence();
await cs('E-05 team pool + exclude A2',async()=>{const k='AOE05'+U;const r=await rule('round_robin','E05',[{criteria:crit(k),method:'sequential',pool:{kind:'team',user_ids:[],team_id:TEAM,excluded_user_ids:[A2]}}]);if(r.s>=300)return E(r);const o=[];for(let i=1;i<=4;i++){const t=await tk(k+' '+i);await sleep(4000);o.push(await own(t));}await setA(r.j.data.id,false);return o.join(',');});
await cs('E-10 team pool sequential (Team A = A2 Mahmoud Samy, A3 Dev Team 2)',async()=>{const k='AOE10'+U;const r=await rule('round_robin','E10',[{criteria:crit(k),method:'sequential',pool:{kind:'team',user_ids:[],team_id:TEAM,excluded_user_ids:[]}}]);const o=[];for(let i=1;i<=4;i++){const t=await tk(k+' '+i);await sleep(4000);o.push(await own(t));}await setA(r.j.data.id,false);return o.join(',');});
await cs('E-11 change pool mid-sequence',async()=>{const k='AOE11'+U;const r=await rule('round_robin','E11',[rrT(k,'sequential',[A1,A2,A3])]);const o=[];for(let i=1;i<=2;i++){const t=await tk(k+' '+i);await sleep(4000);o.push(await own(t));}
 const g=await getRule(r.j.data.id);const p=await api('PUT','/desk/assignment-rules/'+g.id,{type:'round_robin',department_id:DA,name:g.name,description:g.description,is_active:true,execute_on:g.execute_on,version:g.version,targets:[rrT(k,'sequential',[A1,A3])]});o.push('edit '+p.s);
 for(let i=3;i<=5;i++){const t=await tk(k+' '+i);await sleep(4000);o.push(await own(t));}await setA(r.j.data.id,false);return o.join(',');});
await cs('E-12 A2 offline → skipped + history',async()=>{setP('A2','off');await sleep(35000);const pr=await presence();const k='AOE12'+U;const r=await rule('round_robin','E12',[rrT(k,'sequential')]);const o=[];let last;for(let i=1;i<=4;i++){last=await tk(k+' '+i);await sleep(4000);o.push(await own(last));}
 const f=(await feed(last)).find(e=>e.action==='ticket.auto_assigned');await setA(r.j.data.id,false);setP('A2','on');return pr+' → '+o.join(',')+' | history: '+JSON.stringify(f?.summary||{}).slice(0,400);});
R._skipE16=1;//await cs('E-16 all offline → unassigned backlog',async()=>{setP('A1','off');setP('A2','off');setP('A3','off');await sleep(35000);const pr=await presence();const k='AOE16'+U;const r=await rule('round_robin','E16',[rrT(k,'sequential')]);const t=await tk(k);await sleep(5000);const o=await own(t);const f=(await feed(t)).map(e=>e.action+':'+JSON.stringify(e.summary||{}).slice(0,160)).join(' || ');R._e16=[t,r.j.data.id];return pr+' → '+o+' | '+f.slice(0,500);});
setP('A1','on');setP('A2','on');setP('A3','on');
return R;
