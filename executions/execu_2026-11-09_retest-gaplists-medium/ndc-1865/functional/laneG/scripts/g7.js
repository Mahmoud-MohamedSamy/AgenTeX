eval(require('fs').readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-1865/functional/laneG/scripts/lib.js','utf8'));
const o={};
// close F3/F6: deactivate both assignment rules
for(const [id,typ] of [[IDS.ruleDirect,'type=direct'],[IDS.ruleRR,'type=round_robin&department_id='+IDS.D]]){const R=(await api('GET','/desk/assignment-rules?'+typ)).j.data.rules;const g=R.find(x=>x.id===id);const r=await api('PUT','/desk/assignment-rules/'+id+'/active',{is_active:false,version:g.version});o['deact_'+id.slice(0,8)]=r.s;LED('UPDATED assignment rule '+id+' deactivated: '+r.s);}
const s=v=>({kind:'string',stringValue:v});
const SM=(f,op,v)=>({kind:'StringMatch',field:f,operator:op,stringValue:v,caseInsensitive:false});
const trig={kind:'RecordCreated',fieldName:null,dateFieldName:null,offsetSeconds:null,offsetMode:null};
// tag in the QA dept
if(!IDS.tag){const r=await api('POST','/desk/tags',{department_id:IDS.D,name:'QA FT 1865 tag'});o.tag=sh(r);const id=r.j&&r.j.data&&(r.j.data.id||(r.j.data.tag&&r.j.data.tag.id));if(id){IDS.tag=id;LED('CREATED tag "QA FT 1865 tag" '+id);saveIds();}}
// saved (library) action
if(!IDS.wfAction){const r=await api('POST','/workflow/actions',{moduleId:T,name:'QA FT 1865 saved action',isActive:true,action:{type:'FieldUpdate',order:0,delaySeconds:0,fieldUpdates:{description:s('QA FT 1865 set by saved action')}}});o.act=sh(r);const id=r.j&&r.j.data&&r.j.data.id;if(id){IDS.wfAction=id;LED('CREATED workflow saved action '+id);saveIds();}}
const crit={kind:'Logical',operator:'And',operands:[SM('subject','StartsWith','QA FT 1865 WF'),{kind:'Comparison',field:'department',operator:'Equal',value:s(IDS.D)}]};
const mk=async(name,actions)=>{const r=await api('POST','/workflow/rules',{moduleId:T,layoutId:'',name,description:'QA NDC-1865 - safe to delete',mode:'Recurring',isActive:true,trigger:trig,criteria:crit,actions});const id=r.j&&r.j.data&&r.j.data.id;if(id){LED('CREATED workflow rule "'+name+'" '+id);(IDS.wf=IDS.wf||[]).push(id);saveIds();}return{s:r.s,id,e:E(r)};};
o.wf1=await mk('QA FT 1865 WF inline',[{type:'FieldUpdate',order:0,delaySeconds:0,fieldUpdates:{priority:s('high')}},{type:'AddTags',order:1,tagIds:[IDS.tag],mode:'append'}]);
o.wf2=await mk('QA FT 1865 WF saved',[{type:'FieldUpdate',order:0,delaySeconds:0,standaloneActionId:IDS.wfAction}]);
await sleep(2000);
const t=await mkTicket('QA FT 1865 WF ticket',{owner:null},'(F4)');await sleep(10000);
const x=await getT(t.id);o.after={priority:x.priority,description:x.description};
const tg=await api('GET','/desk/tickets/'+t.id+'/tags');o.tags=tg.s+' '+tg.t.slice(0,300);
const ex=await api('GET','/workflow/executions?recordId='+t.id);o.exec=ex.s+' '+JSON.stringify(arr(ex.j&&ex.j.data).slice(0,4).map(e=>[e.ruleName||e.ruleId,e.status,e.error||'']));
return o;
