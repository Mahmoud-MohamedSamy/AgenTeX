// Skills runtime in QA AS6 Dept A: H-03, H-06, H-07, H-08, H-09, H-11, E-14 (no-skill pool). Borrows QA AS6 skills; restores criteria, agents, order, preferences in finally.
eval(fs.readFileSync('lib-as.js','utf8'));const R={};const cs=async(id,fn)=>{try{R[id]=await fn();}catch(e){R[id]='ERR '+e.message.slice(0,160);}};
const q='department_id='+DA;
const list=async()=>{const s=(await api('GET','/desk/skills?'+q)).j?.data;return Array.isArray(s)?s:(s?.skills||[]);};
const L0=await list();const ORDER0=L0.map(s=>s.id);const PREF0=(await api('GET','/desk/skill-preferences?'+q)).j?.data;R.pref0=PREF0;
const bor=L0.filter(s=>/^QA AS6 sk/i.test(s.name)||(/^QA AS6/.test(s.name)&&!/img/.test(s.name)));const SAVE={};
const body=s=>({name:s.name,type_id:s.type_id,description:s.description,is_active:s.is_active,criteria:s.criteria});
const setCrit=async(s,key,active)=>{if(!SAVE[s.id])SAVE[s.id]={...body(s),agent_ids:s.agent_ids};return (await api('PUT','/desk/skills/'+s.id,{...body(s),is_active:active??s.is_active,criteria:{conditions:[{field_key:'description',operator:'contains',value:key}],pattern:null}})).s;};
const setAgents=async(s,ids)=>{if(!SAVE[s.id])SAVE[s.id]={...body(s),agent_ids:s.agent_ids};return (await api('PUT','/desk/skills/'+s.id+'/agents',{user_ids:ids})).s;};
const tskills=async id=>(await rec(id)).skills||[];
const act=L0.filter(s=>s.is_active&&/^QA AS6/.test(s.name)&&!/img/.test(s.name));const inact=L0.find(s=>!s.is_active);
R.pool={active:act.length,inactive:inact?.name};
try{
 await cs('H-03 inactive skill never added',async()=>{const k='AOH03'+U;await setCrit(inact,k,false);const t=await tk(k);await sleep(6000);return JSON.stringify(await tskills(t));});
 await cs('H-06 ticket skills follow list order; reorder',async()=>{const k='AOH06'+U;const [s1,s2]=act;await setCrit(s1,k);await setCrit(s2,k);const t1=await tk(k+' a');await sleep(6000);const a=await tskills(t1);
  const ord=[...ORDER0];const i1=ord.indexOf(s1.id),i2=ord.indexOf(s2.id);[ord[i1],ord[i2]]=[ord[i2],ord[i1]];const p=await api('PUT','/desk/skills/order?'+q,{skill_ids:ord});const t2=await tk(k+' b');await sleep(6000);const b=await tskills(t2);
  await api('PUT','/desk/skills/order?'+q,{skill_ids:ORDER0});return 'before '+JSON.stringify(a)+' | reorder '+p.s+' → '+JSON.stringify(b);});
 await cs('H-07 on update; auto-add off → not added',async()=>{const k='AOH07'+U;const s=act[2];await setCrit(s,k);const t=await tk('AOH07x'+U);await sleep(5000);const before=await tskills(t);await patch(t,{description:'QA AO '+k+' now'});await sleep(6000);const afterUpd=await tskills(t);
  const p=await api('PUT','/desk/skill-preferences?'+q,{...PREF0,auto_add:false});const t2=await tk(k+' off');await sleep(6000);const offRes=await tskills(t2);await api('PUT','/desk/skill-preferences?'+q,PREF0);
  return 'create(no match) '+JSON.stringify(before)+' → update '+JSON.stringify(afterUpd)+' | auto_add off ('+p.s+') → '+JSON.stringify(offRes);});
 await cs('H-08 recalculate removes stale skill',async()=>{const k='AOH08'+U;const s=act[3];await setCrit(s,k);const t=await tk(k);await sleep(6000);const a=await tskills(t);await api('PUT','/desk/skills/'+s.id,{...body(s),criteria:{conditions:[{field_key:'description',operator:'contains',value:'nevermatch'+U}],pattern:null}});
  const r=await api('POST','/desk/tickets/'+t+'/skills/recalculate',{});await sleep(4000);return JSON.stringify(a)+' → recalc '+r.s+' → '+JSON.stringify(await tskills(t));});
 await cs('H-09 Assign by Skills',async()=>{const k='AOH09'+U;const s=act[4];await setCrit(s,k);await setAgents(s,[A2]);const t=await tk(k);await sleep(6000);const sk=await tskills(t);const a=await api('POST','/desk/tickets/'+t+'/skills/assign',{});await sleep(3000);
  const t0=await tk('AOH09none'+U);await sleep(4000);const b=await api('POST','/desk/tickets/'+t0+'/skills/assign',{});return 'skills '+JSON.stringify(sk)+' → '+E(a)+' owner '+(await own(t))+' | no skills: '+E(b);});
 await cs('H-11 10 skills per ticket; 30 active cap',async()=>{const k='AOH11'+U;for(const s of act.slice(0,11))await setCrit(s,k);const t=await tk(k);await sleep(8000);const n=(await tskills(t)).length;
  const p=await api('PUT','/desk/skills/'+inact.id,{...body(inact),is_active:true});if(p.s<300)await api('PUT','/desk/skills/'+inact.id,{...body(inact),is_active:false});return 'ticket got '+n+' skills (11 matched) | activate 31st: '+E(p);});
 await cs('E-14 skill rule pool A2 only, ticket without skills',async()=>{const k='AOE14'+U;const r=await rule('round_robin','E14',[rrT(k,'skill',[A2])]);const o=[];for(let i=1;i<=3;i++){const t=await tk(k+' '+i);o.push(await waitOwn(t,16));}await setA(r.j.data.id,false);return o.join(',');});
 await cs('E-14b skill rule, ticket skill held by A3 only, pool A1–A3',async()=>{const k='AOE14b'+U;const s=act[5];await setCrit(s,k);await setAgents(s,[A3]);const r=await rule('round_robin','E14b',[rrT(k,'skill')]);const o=[];for(let i=1;i<=2;i++){const t=await tk(k+' '+i);o.push(await waitOwn(t,16));}await setA(r.j.data.id,false);return o.join(',');});
}finally{
 const rs={};for(const [id,b] of Object.entries(SAVE)){const a=b.agent_ids;delete b.agent_ids;rs[id.slice(0,6)]=(await api('PUT','/desk/skills/'+id,b)).s+'/'+(await api('PUT','/desk/skills/'+id+'/agents',{user_ids:a})).s;}
 R.restoreSkills=rs;R.restoreOrder=(await api('PUT','/desk/skills/order?'+q,{skill_ids:ORDER0})).s;R.restorePref=(await api('PUT','/desk/skill-preferences?'+q,PREF0)).s;
 const L1=await list();R.diff=L1.filter(s=>{const o=L0.find(x=>x.id===s.id);return !o||JSON.stringify(o.criteria)!==JSON.stringify(s.criteria)||o.is_active!==s.is_active||JSON.stringify(o.agent_ids)!==JSON.stringify(s.agent_ids);}).map(s=>s.name);
 R.orderSame=JSON.stringify(L1.map(s=>s.id))===JSON.stringify(ORDER0);}
return R;
