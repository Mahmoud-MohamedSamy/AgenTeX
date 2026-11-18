const J=JSON.parse(fs.readFileSync(RUN+'/scripts/b2/3065.json','utf8'));const DD=J.DD;const o={};
const sts=()=>[ST('Open',{position:{x:0,y:0}}),ST('Escalated',{position:{x:350,y:0}}),ST('Closed',{isTerminal:true,position:{x:700,y:0}})];
const g0=(await api('GET','/desk/departments/'+DD)).j?.data;if(!g0){log('dept missing');return 'dept missing';}
o.before={name:g0.name,agents:g0.agent_user_ids.map(x=>x===OWNER?'OWNER':x===AG_A?'CES2':x.slice(0,8)),vo:g0.view_only_agent_user_ids.map(x=>x===AG_A?'CES2':x.slice(0,8))};
const setDept=(vo)=>api('PATCH','/desk/departments/'+DD,{name:g0.name,agent_user_ids:[OWNER,AG_A],view_only_agent_user_ids:vo});
let r=await setDept([]);o.normal0=E(r);LED('r3112: CES2 normal member of '+g0.name+' '+DD+' (restore to before at end)');
const b=await mkBp(DEF('r3112 dyn',sts(),[TR('go','Open','Escalated'),TR('end','Escalated','Closed')],{dynamicOwners:true,departmentId:DD}));o.dynBp=E(b.r);
const t=await mkT('r3112 dyn','t1',{},DD);o.inBp=!!(await waitIn(t,30));
const put=u=>api('PUT',`/modules/${TK}/records/${t}/blueprint/owners/go`,{userIds:u,teamIds:[],departmentOwners:[]});
const elig=async()=>{const e=await api('GET','/desk/departments/'+DD+'/eligible-owners');return e.s+' hasCES2='+JSON.stringify(e.j?.data||'').includes(AG_A);};
o.cycles=[];
for(const d of [300,1000,3000,300]){const c={delayMs:d};
 c.setNormal=E(await setDept([]));await sleep(2000);
 c.primePut=E(await put([AG_A]));c.primeElig=await elig();
 const t0=Date.now();c.setVO=E(await setDept([AG_A]));await sleep(d);
 const bad=await api('POST',`/modules/${TK}/blueprints`,{definition:DEF('r3112 vo-bad',sts(),[TR('x','Open','Escalated',{before:{allowedUserIds:[AG_A]}}),TR('end','Escalated','Closed')],{departmentId:DD}),isActive:false});
 c.saveBp=E(bad)+' @'+(Date.now()-t0)+'ms';if(bad.j?.data?.id){made.bps.push(bad.j.data.id);keep();LED('blueprint created (UNEXPECTED) '+bad.j.data.id+' r3112 vo-bad inactive');}
 c.putOwner=E(await put([AG_A]))+' @'+(Date.now()-t0)+'ms';
 c.eligAfter=await elig()+' @'+(Date.now()-t0)+'ms';
 o.cycles.push(c);}
o.putOwnerSelf=E(await put([OWNER]));
await sleep(31000);o.elig31s=await elig();
r=await api('PATCH','/desk/departments/'+DD,{name:g0.name,agent_user_ids:g0.agent_user_ids,view_only_agent_user_ids:g0.view_only_agent_user_ids});o.restore=E(r);LED('r3112: '+g0.name+' members restored to before ('+r.s+')');
fs.mkdirSync(RUN+'/scripts/b2/out',{recursive:true});fs.writeFileSync(RUN+'/scripts/b2/out/r3112.json',JSON.stringify(o,null,1));log(JSON.stringify(o,null,1));
