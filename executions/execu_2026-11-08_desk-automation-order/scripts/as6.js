// Batch 6: D-13 (A3 removed from AS6 Dept A; direct switch on then off, user OK; A3 restored), I-03 (20 at once, pool A2+A3, 5 each), I-04 (time to owner), J-02 (current defaults read).
eval(fs.readFileSync('lib-as.js','utf8'));const R={};const cs=async(id,fn)=>{try{R[id]=await fn();}catch(e){R[id]='ERR '+e.message.slice(0,160);}};
const orig=await notif();
await cs('D-13 agent removed from dept',async()=>{const k='AOD13'+U;const d=(await api('GET','/desk/departments/'+DA)).j.data;const o={};
 try{await api('PUT','/desk/assignment/notification-settings',{...orig,direct_rules_enabled:true});
  const dr=await rule('direct','D13',[daT(k+'d',ag(A3))]);const rr=await rule('round_robin','D13rr',[{criteria:crit(k+'t'),method:'sequential',pool:{kind:'team',user_ids:[],team_id:TEAM,excluded_user_ids:[]}}]);
  o.remove=(await api('PUT','/desk/departments/'+DA,{...d,agent_user_ids:d.agent_user_ids.filter(x=>x!==A3)})).s;await sleep(5000);
  const g=await getRule(dr.j.data.id);o.ruleShows=JSON.stringify({ineligible:g?.targets?.[0]?.ineligible,unknown:g?.targets?.[0]?.unknown_user_ids}).slice(0,200);
  const t1=await tk(k+'d');o.direct=await waitOwn(t1,12);const tt=[];for(let i=1;i<=3;i++){const t=await tk(k+'t '+i);tt.push(await waitOwn(t,12));}o.teamRR=tt.join(',');
  await setA(dr.j.data.id,false);await setA(rr.j.data.id,false);
 }finally{const d2=(await api('GET','/desk/departments/'+DA)).j.data;o.restoreA3=(await api('PUT','/desk/departments/'+DA,{...d2,agent_user_ids:[...new Set([...d2.agent_user_ids,A3])]})).s;o.switchRestore=(await api('PUT','/desk/assignment/notification-settings',orig)).s;o.switchAfter=(await notif()).direct_rules_enabled;}
 o.a3Back=(await api('GET','/desk/departments/'+DA)).j.data.agent_user_ids.includes(A3);return o;});
await sleep(20000);
const P0=await prefs();
try{
 await cs('I-03 20 at once, pool A2+A3, 5 each',async()=>{const c2=(await wl(A2)).all,c3=(await wl(A3)).all;const k='AOI03'+U;
  const p=await setPrefs({...P0,department_threshold_enabled:true,department_threshold:1,agent_threshold_enabled:true,agent_thresholds:[{user_id:A2,threshold:Math.min(200,c2+5)},{user_id:A3,threshold:Math.min(200,c3+5)}]});
  const r=await rule('round_robin','I03',[rrT(k,'sequential',[A2,A3])]);
  const ids=await Promise.all(Array.from({length:20},(_,i)=>tk(k+' '+i)));await sleep(25000);
  const cnt={};let dbl=0;for(const id of ids){const o=await own(id);cnt[o]=(cnt[o]||0)+1;const n=(await feed(id)).filter(e=>e.action==='ticket.auto_assigned').length;if(n>1)dbl++;}
  await setA(r.j.data.id,false);return 'prefs '+E(p)+' thresholds A2 '+(c2+5)+' A3 '+(c3+5)+' → '+JSON.stringify(cnt)+' double-assigned '+dbl;});
}finally{R.prefsRestore=E(await setPrefs(P0));}
await cs('I-04 time to owner, 20 tickets',async()=>{const k='AOI04'+U;const r=await rule('round_robin','I04',[rrT(k,'sequential')]);const ids=[];for(let i=0;i<20;i++){ids.push(await tk(k+' '+i));await sleep(500);}await sleep(20000);
 const ts=[];for(const id of ids){const f=await feed(id);const c=f.find(e=>e.action==='ticket.created'),a=f.find(e=>e.action==='ticket.auto_assigned');ts.push(a?(new Date(a.occurred_at)-new Date(c.occurred_at))/1000:999);}
 await setA(r.j.data.id,false);ts.sort((a,b)=>a-b);return 'within 5 s: '+ts.filter(x=>x<=5).length+'/20; median '+ts[10].toFixed(1)+' s; p95 '+ts[18].toFixed(1)+' s; max '+ts[19].toFixed(1)+' s';});
await cs('J-02 defaults across departments',async()=>{const ds=(await api('GET','/desk/departments')).j?.data||[];const o={n:ds.length,thrOn:[],backlogOn:[],taOff:[]};for(const d of ds){const p=await prefs(d.id);if(p?.department_threshold_enabled||p?.agent_threshold_enabled)o.thrOn.push(d.name);if(p?.assign_backlogs||p?.assign_on_closure)o.backlogOn.push(d.name);const ta=(await api('GET','/desk/departments/'+d.id+'/team-assignment')).j?.data;if(ta&&ta.enabled===false)o.taOff.push(d.name);}return o;});
return R;
