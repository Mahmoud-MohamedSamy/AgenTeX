eval(require('fs').readFileSync('lib.js','utf8'));
const o={};const DA=IDS.DA;const NM={[IDS.A1]:'A1',[IDS.A2]:'A2',[IDS.A3]:'A3'};const nm=x=>x?(NM[x]||String(x).slice(0,8)):'-';
const tn=async()=>(await api('GET','/desk/skill-types?department_id='+DA)).j.data.types.map(t=>t.name);
if(!(await tn()).includes('Tech')){const add=await api('POST','/desk/skill-types?department_id='+DA,{name:'Tech'});o.readd=add.s+' '+((add.j&&add.j.error&&add.j.error.message)||'');LED('"Tech" re-added in QA AS6 Dept A: '+add.s);}o.A=await tn();
const R0=await getRule(IDS.RR_SKILL);const pr0=(await api('GET','/desk/departments/'+DA+'/round-robin-preferences')).j.data;o.rule={active:R0.is_active,on:R0.execute_on,method:R0.targets[0].method,crit:JSON.stringify(R0.targets[0].criteria).slice(0,140)};
try{
 o.putRule=(await putRule(IDS.RR_SKILL,{execute_on:['create','update']})).s;await api('PUT','/desk/departments/'+DA+'/round-robin-preferences',{...pr0,assign_to_offline_agents:true});LED('NDC-2821: RR_SKILL create+update + Dept A offline ON temporarily');
 const t=await mkTicket('QA AS6 SKR QA AS6 SK2 rt14',DA,{},'NDC-2821');o.create=t.s;await sleep(7000);const g=await getT(t.id);o.skills=g.skills;o.owner=nm((await own(t.id)).owner);
 const a=await act(t.id);o.h=(Array.isArray(a)?a:[]).filter(e=>e.action==='ticket.auto_assigned').map(e=>e.summary.rule_type+'/'+e.summary.method+'/'+e.summary.trigger+'/'+nm(e.summary.owner_id));
 const rc=await api('POST','/desk/tickets/'+t.id+'/skills/recalculate',{});o.recalc=rc.s+' '+((rc.j&&rc.j.error&&rc.j.error.message)||'');await sleep(2500);o.afterRecalc=(await getT(t.id)).skills;
 const as=await api('POST','/desk/tickets/'+t.id+'/skills/assign',{});o.assign=as.s+' '+((as.j&&as.j.error&&as.j.error.message)||'');await sleep(2000);o.ownerAfterAssign=nm((await own(t.id)).owner);
}finally{
 o.back=[(await putRule(IDS.RR_SKILL,{execute_on:R0.execute_on})).s,(await api('PUT','/desk/departments/'+DA+'/round-robin-preferences',pr0)).s];LED('NDC-2821: RR_SKILL + Dept A prefs restored');
 o.chk={on:(await getRule(IDS.RR_SKILL)).execute_on,off:(await api('GET','/desk/departments/'+DA+'/round-robin-preferences')).j.data.assign_to_offline_agents};
}
return o;
