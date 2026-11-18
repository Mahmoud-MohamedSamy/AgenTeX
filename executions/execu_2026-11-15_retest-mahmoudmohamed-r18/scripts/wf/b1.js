const R={};const CT={kind:'RecordCreated'};
// 2999 team controls
for(const [n,v] of [['teamReal','485a7732-c380-428a-a9aa-e14e76efff14'],['teamUuid','11111111-2222-3333-4444-555555555555']]){const r=await mkRule('2999'+n,CT,[{type:'OwnerAssignment',ownerTargetKind:'Team',ownerValue:v}]);R['2999'+n]=r.res+(r.id?' id '+r.id:'');}
// 2951 same field twice
const same=await mkRule('2951same',CT,[{type:'FieldUpdate',fieldUpdates:{description:S('one')}},{type:'FieldUpdate',fieldUpdates:{description:S('two')}}]);R['2951same']=same.res;
// 2951 three FUs, active, run on a ticket
const fu=await mkRule('2951',CT,[{type:'FieldUpdate',fieldUpdates:{priority:S('High')}},{type:'FieldUpdate',fieldUpdates:{description:S('QA RT18 2951 second FU')}},{type:'FieldUpdate',fieldUpdates:{classification:S('Problem')}}],{isActive:true});R['2951save']=fu.res+' '+fu.id;
// 2958 placeholders, active
const ph=await mkRule('2958',CT,[{type:'FieldUpdate',fieldUpdates:{description:S('R[${recordId}] M[${moduleId}] S[${subject}]')}}],{isActive:true});R['2958save']=ph.res+' '+ph.id;
await sleep(3000);
const t1=fu.id?await mkTicket('2951',{priority:'Low',description:'QA RT18 before'}):null;const t2=ph.id?await mkTicket('2958'):null;R.tickets=[t1,t2];
await sleep(20000);
if(t1?.id){const g=await getTicket(t1.id);R['2951ticket']={id:t1.id,priority:g.priority,description:g.description,classification:g.classification,num:g._number,ticket_number:g.ticket_number};R['2951exec']=await execs(t1.id);}
if(t2?.id){const g=await getTicket(t2.id);R['2958ticket']={id:t2.id,description:g.description,num:g.ticket_number,moduleId:T};R['2958exec']=await execs(t2.id);}
if(fu.id)R.deact2951=await deact(fu.id);if(ph.id)R.deact2958=await deact(ph.id);
// 2965 two saves from same copy
if(fu.id){const g=(await api('GET','/workflow/rules/'+fu.id)).j?.data;const v=g.version;R['2965start']={name:g.name,version:v,isActive:g.isActive};
 const base={name:g.name,description:g.description,moduleId:g.moduleId,departmentIds:g.departmentIds,trigger:g.trigger,criteria:g.criteria,mode:g.mode,isActive:false,actions:g.actions.map(a=>({type:a.type,order:a.order,delaySeconds:a.delaySeconds,fieldUpdates:a.fieldUpdates}))};
 const a=await api('PATCH','/workflow/rules/'+fu.id,{...base,name:g.name+' renamed B',version:v});R['2965saveB']=short(a);
 const b=await api('PATCH','/workflow/rules/'+fu.id,{...base,description:'QA RT18 stale A desc',version:v});R['2965staleA']=short(b);
 const c=await api('PATCH','/workflow/rules/'+fu.id,{...base,description:'QA RT18 no version'});R['2965noVersion']=short(c);
 const g2=(await api('GET','/workflow/rules/'+fu.id)).j?.data;R['2965after']={name:g2.name,description:g2.description,version:g2.version,isActive:g2.isActive};}
save('b1',R);return R;
