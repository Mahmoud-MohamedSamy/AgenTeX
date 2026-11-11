// Batch 3: D-12 redo (direct switch on/off, user OK), E-12 redo, F-01, F-03, F-05, F-06, F-07, F-08, F-09, F-13. QA AS6 Dept A prefs restored in finally.
eval(fs.readFileSync('lib-as.js','utf8'));const R={};const cs=async(id,fn)=>{try{R[id]=await fn();}catch(e){R[id]='ERR '+e.message.slice(0,150);}};
const all=async()=>({A1:(await wl(A1)).all,A2:(await wl(A2)).all,A3:(await wl(A3)).all});
const orig=await notif();
try{
 await cs('D-12a active rule, direct master OFF → nothing',async()=>{const k='AOD12'+U;const r=await rule('direct','D12',[daT(k,ag(A1))]);R._d12=r.j?.data?.id;const t=await tk(k+' a');await sleep(4000);const o=await own(t);await setA(R._d12,false);return o;});
 R.switchOn=(await api('PUT','/desk/assignment/notification-settings',{...orig,direct_rules_enabled:true})).s;
 await cs('D-12b inactive rule, master ON → nothing',async()=>{const t=await tk('AOD12'+U+' b');await sleep(4000);return await own(t);});
}finally{R.switchRestore=(await api('PUT','/desk/assignment/notification-settings',orig)).s;R.switchAfter=(await notif()).direct_rules_enabled;}
R.presence=await presence();
await cs('E-12 A2 offline → skipped, history',async()=>{setP('A2','off');await sleep(30000);const pr=await presence();const k='AOE12'+U;const r=await rule('round_robin','E12',[rrT(k,'sequential')]);const o=[];let last;for(let i=1;i<=4;i++){last=await tk(k+' '+i);await sleep(4000);o.push(await own(last));}
 const f=(await feed(last)).find(e=>e.action==='ticket.auto_assigned');await setA(r.j.data.id,false);setP('A2','on');return pr+' → '+o.join(',')+' | E-19 history: '+JSON.stringify(f?.summary||{}).slice(0,500);});
await sleep(25000);
const P0=await prefs();R.prefs0=P0;
try{
 const k='AOF'+U;const r=await rule('round_robin','F',[rrT(k,'sequential')],{on:['create','update']});const RID=r.j.data.id;
 const c=await all();R.counts=c;const mx=Math.max(c.A1,c.A2,c.A3);
 await cs('F-03 + F-09 threshold 1 → backlog, both off → stays',async()=>{await setPrefs({...P0,department_threshold_enabled:true,department_threshold:1,assign_backlogs:false,assign_on_closure:false});const b1=await tk(k+' b1');await sleep(3000);const b2=await tk(k+' b2');await sleep(4000);R._b=[b1,b2];const a=await own(b1),b=await own(b2);await sleep(70000);return 'at once '+a+','+b+' | after 70 s '+(await own(b1))+','+(await own(b2));});
 await cs('F-07 assign backlogs on (limit 1, created time)',async()=>{const p=await setPrefs({...P0,department_threshold_enabled:true,department_threshold:Math.min(200,mx+10),assign_backlogs:true,backlog_limit:1,backlog_order:'created_time',assign_on_closure:false});const t0=Date.now();let o;for(let i=0;i<12;i++){await sleep(10000);o=[await own(R._b[0]),await own(R._b[1])];if(o[0]!=='none'&&o[1]!=='none')break;}return 'prefs '+E(p)+' → '+o.join(',')+' after '+Math.round((Date.now()-t0)/1000)+' s';});
 await cs('F-02 API invalid thresholds',async()=>{const o={};for(const v of [0,201,1.5]){o[v]=E(await setPrefs({...P0,department_threshold_enabled:true,department_threshold:v}));}o.limit0=E(await setPrefs({...P0,assign_backlogs:true,backlog_limit:0}));o.limit51=E(await setPrefs({...P0,assign_backlogs:true,backlog_limit:51}));return o;});
 await cs('F-05 dept 1, A1 agent threshold 200 → only A1',async()=>{const p=await setPrefs({...P0,department_threshold_enabled:true,department_threshold:1,agent_threshold_enabled:true,agent_thresholds:[{user_id:A1,threshold:200}]});const o=[];for(let i=1;i<=3;i++){const t=await tk(k+' f5 '+i);await sleep(4000);o.push(await own(t));}return E(p)+' → '+o.join(',');});
 await cs('F-06 agent threshold switch off → A1 back to dept limit, row kept',async()=>{const p=await setPrefs({...P0,department_threshold_enabled:true,department_threshold:1,agent_threshold_enabled:false,agent_thresholds:[{user_id:A1,threshold:200}]});const t=await tk(k+' f6');await sleep(4000);const pr=await prefs();return E(p)+' → '+(await own(t))+' | rows kept: '+JSON.stringify(pr.agent_thresholds);});
 await cs('F-01 assign to offline agents on, A2 offline',async()=>{await setPrefs({...P0,assign_to_offline_agents:true});setP('A2','off');await sleep(30000);const pr=await presence();const o=[];for(let i=1;i<=3;i++){const t=await tk(k+' f1 '+i);await sleep(4000);o.push(await own(t));}setP('A2','on');await setPrefs(P0);return pr+' → '+o.join(',');});
 await sleep(25000);
 await cs('F-08 assign on closure (pool A1 only)',async()=>{const k8='AOF8'+U;const r8=await rule('round_robin','F8',[rrT(k8,'sequential',[A1])]);const a1=(await all()).A1;
  await setPrefs({...P0,department_threshold_enabled:true,department_threshold:Math.min(200,a1+1),assign_backlogs:false,assign_on_closure:true});const first=await tk(k8+' first');await sleep(4000);const fo=await own(first);
  const back=await tk(k8+' backlog');await sleep(4000);const bo=await own(back);
  const cl=await api('POST','/desk/tickets/'+first+'/close',{});await sleep(5000);const after=await own(back);
  await setA(r8.j.data.id,false);return 'threshold '+(a1+1)+': first→'+fo+', next→'+bo+' (backlog), close '+cl.s+' → backlog now '+after;});
 await cs('F-13 team ticket, no RR → stays in team queue',async()=>{const t=await tk('AOF13'+U);const a=await api('POST','/desk/tickets/'+t+'/assign',{owner_id:null,team_id:TEAM});await sleep(15000);return a.s+' → '+(await st(t));});
 await setA(RID,false);
}finally{R.prefsRestore=E(await setPrefs(P0));}
return R;
