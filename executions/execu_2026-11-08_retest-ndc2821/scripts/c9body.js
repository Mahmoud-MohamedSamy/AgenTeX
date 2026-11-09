const o={};const T='88e8ea44-1658-4df3-9930-d0902b91073d';const NM={[IDS.A1]:'A1',[IDS.A2]:'A2',[IDS.A3]:'A3'};
const add=await api('POST','/desk/skill-types?department_id='+DA,{name:'Tech'});o.readd=add.s+' '+((add.j&&add.j.error&&add.j.error.message)||'');o.A=await tnames(DA);LED('"Tech" re-added in QA AS6 Dept A: '+add.s);
const enc=v=>({kind:'string',value:String(v)});const mk=async s=>{const r=await api('POST','/modules/'+T+'/records',{data:Object.entries({subject:s,department:DA,status:'Open',priority:'Medium',email:'qa.rt14@example.com'}).map(([field,v])=>({field,value:enc(v)}))});const d=r.j&&r.j.data;const id=d&&(d.id||(d.record&&d.record.id));if(id)LED('ticket "'+s+'" '+id);return{s:r.s,id,t:r.t.slice(0,160)};};
const flat=d=>{const m={};for(const x of (d&&d.data)||[])m[x.field]=x.value&&(x.value.value!==undefined?x.value.value:(x.value.items||x.value));return m;};
const get=async id=>{const r=await api('GET','/modules/'+T+'/records/'+id);const d=r.j&&r.j.data;return d&&(d.record||d);};
const R0=(await api('GET','/desk/assignment-rules/'+IDS.RR_SKILL)).j.data;const pr0=(await api('GET','/desk/departments/'+DA+'/round-robin-preferences')).j.data;o.rule={active:R0.is_active,on:R0.execute_on,target:JSON.stringify(R0.targets&&R0.targets[0]&&R0.targets[0].criteria).slice(0,160),method:R0.targets&&R0.targets[0]&&R0.targets[0].method};
try{
 const p=await api('PUT','/desk/assignment-rules/'+IDS.RR_SKILL,{...R0,execute_on:['create','update']});o.putRule=p.s;await api('PUT','/desk/departments/'+DA+'/round-robin-preferences',{...pr0,assign_to_offline_agents:true});LED('RR_SKILL create+update + Dept A offline ON temporarily');
 const t=await mk('QA RT14 SKR QA AS6 SK2 routing');o.create=t.s;await sleep(7000);const g=await get(t.id);o.keysSample=Object.keys(g||{}).slice(0,8);const a=await api('GET','/desk/tickets/'+t.id+'/activity');const f=JSON.stringify(g);o.hasSk2=/QA AS6 sk2/i.test(f);const ow=g.owner||(flat(g).owner);o.owner=ow&&(NM[ow.id||ow.value||ow]||String(ow.id||ow.value||ow).slice(0,8));
 const rc=await api('POST','/desk/tickets/'+t.id+'/skills/recalculate',{});o.recalc=rc.s+' '+((rc.j&&rc.j.error&&rc.j.error.message)||'');await sleep(2500);o.afterRecalcHasSk2=/QA AS6 sk2/i.test(JSON.stringify(await get(t.id)));
 const as=await api('POST','/desk/tickets/'+t.id+'/skills/assign',{});o.assign=as.s+' '+((as.j&&as.j.error&&as.j.error.message)||'');
}finally{
 const cur=(await api('GET','/desk/assignment-rules/'+IDS.RR_SKILL)).j.data;o.back=[(await api('PUT','/desk/assignment-rules/'+IDS.RR_SKILL,{...cur,execute_on:R0.execute_on})).s,(await api('PUT','/desk/departments/'+DA+'/round-robin-preferences',pr0)).s];LED('RR_SKILL + Dept A prefs restored');
 o.chk={on:(await api('GET','/desk/assignment-rules/'+IDS.RR_SKILL)).j.data.execute_on,off:(await api('GET','/desk/departments/'+DA+'/round-robin-preferences')).j.data.assign_to_offline_agents};
}
return o;
