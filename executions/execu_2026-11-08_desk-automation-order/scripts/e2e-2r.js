// E2E-1 (direct move to AS6-A unassigned + AS6-A sequential RR, 6 tickets; direct switch on then off, user OK), E2E-2 (skill + closure backlog), E2E-3 (offline/back + assign backlogs).
eval(fs.readFileSync('lib-as.js','utf8'));const R={};const cs=async(id,fn)=>{try{R[id]=await fn();}catch(e){R[id]='ERR '+e.message.slice(0,160);}};
const orig=await notif();const P0=await prefs();const q='department_id='+DA;const nums={};
await cs('E2E-2',async()=>{const k='AOE2E2'+U;const L=(await api('GET','/desk/skills?'+q)).j?.data;const SL=Array.isArray(L)?L:(L?.skills||[]);const s=SL.filter(x=>x.is_active&&/^QA AS6 cap/.test(x.name))[7];
 const save={name:s.name,type_id:s.type_id,description:s.description,is_active:true,criteria:s.criteria};const ag0=s.agent_ids;const o=[];
 try{await api('PUT','/desk/skills/'+s.id,{...save,criteria:{conditions:[{field_key:'description',operator:'contains',value:k+'S'}],pattern:null}});await api('PUT','/desk/skills/'+s.id+'/agents',{user_ids:[A2]});
  await setPrefs({...P0,assign_on_closure:true,assign_backlogs:false});
  const r=await rule('round_robin','E2E2',[rrT(k,'skill',[A2])]);const t1=await tk(k+' '+k+'S skill');o.push('skill ticket → '+(await waitOwn(t1,16))+' skills '+JSON.stringify((await rec(t1)).skills));const a2=(await wl(A2)).all;o.push('A2 open '+a2);await setPrefs({...P0,department_threshold_enabled:true,department_threshold:Math.min(200,a2),assign_on_closure:true,assign_backlogs:false});await sleep(3000);
  const t2=await tk(k+' '+k+'S backlog');await sleep(12000);o.push('second → '+(await own(t2))+' (A2 at threshold)');
  fs.writeFileSync('../e2e2.json',JSON.stringify({close:t1,back:t2,rule:r.j.data.id}));
 }finally{R._e2e2restore={skill:s.id,save,ag0};fs.writeFileSync('../e2e2-restore.json',JSON.stringify(R._e2e2restore));}
 return o;});
return R;
