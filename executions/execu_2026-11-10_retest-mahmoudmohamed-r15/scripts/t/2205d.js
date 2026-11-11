const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-10_retest-mahmoudmohamed-r15';
const LED=m=>fs.appendFileSync(RUN+'/ledger.md','- '+new Date().toISOString().slice(0,19)+' DESK '+m+'\n');
const T='88e8ea44-1658-4df3-9930-d0902b91073d'; const E=r=>r.j&&r.j.error?r.j.error.code+': '+r.j.error.message+' '+JSON.stringify(r.j.error.details||'').slice(0,300):'';
const CS='7e1ac409-58b0-41ab-97e1-0e7d5c8c5158', AO='93949fbd-f9df-4e2e-ae45-00b8dc38385b';
const tag = async (d, name) => { const r = await api('POST','/desk/tags',{department_id:d,name}); const id=r.j&&r.j.data&&(r.j.data.id||(r.j.data.tag&&r.j.data.tag.id)); if(id) LED('tag "'+name+'" dept '+d.slice(0,8)+' '+id); return id||('ERR '+r.s+' '+E(r)); };
const ids={};
for (const k of ['created','edited','fieldchanged']) { ids[k]=[await tag(CS,'QA RT15 '+k), await tag(AO,'QA RT15 '+k)]; }
const SM=(f,op,v)=>({kind:'StringMatch',field:f,operator:op,stringValue:v,caseInsensitive:false});
const crit={kind:'Logical',operator:'And',operands:[SM('subject','StartsWith','QA RT15 2205')]};
const base={fieldName:null,dateFieldName:null,offsetSeconds:null,offsetMode:null};
const mk = async (name, trigger, tagIds) => { const r = await api('POST','/workflow/rules',{moduleId:T,layoutId:'',name,description:'QA RT15 retest NDC-2205 - safe to delete',mode:'Recurring',isActive:true,trigger,criteria:crit,actions:[{type:'AddTags',order:0,delaySeconds:0,tagIds}]}); const id=r.j&&r.j.data&&r.j.data.id; if(id) LED('workflow rule "'+name+'" '+id); return {s:r.s,id,e:E(r)}; };
const out={tags:ids};
out.create = await mk('QA RT15 2205 On Create', {...base, kind:'RecordCreated'}, ids.created);
out.edit = await mk('QA RT15 2205 On Edit', {...base, kind:'RecordUpdated'}, ids.edited);
out.fc = await mk('QA RT15 2205 Subject changed', {...base, kind:'SpecificFieldChanged', fieldName:'subject', fieldNames:['subject'], fieldMatch:'any', alsoOnCreate:false}, ids.fieldchanged);
fs.writeFileSync(RUN+'/out/2205-ids.json', JSON.stringify(out,null,1));
return out;
