eval(require('fs').readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-backlog/scripts/lib.js','utf8'));
const g=await api('GET','/modules/'+T+'/layouts/'+IDS.layout);const L=g.j.data;
const F=arr((await api('GET','/modules/'+T+'/fields')).j.data).filter(f=>[IDS.fDec,IDS.fDef].includes(f.id));
const entry=f=>({id:f.id,apiName:f.apiName,fieldName:f.fieldName,labels:f.labels,datatypeKey:f.datatypeKey,config:{...f.config},datatypeOptions:f.datatypeOptions||{},isSystemField:false,isDeletable:true,isSystemManaged:false,fieldOrder:f.fieldOrder});
for(const v of ['CREATE','DETAIL']){const lay=L.views[v].layout;const col=lay.sections[0].columns[0];for(const f of F)if(!col.fields.some(x=>x.id===f.id))col.fields.push(entry(f));
 lay.unusedFieldIds=(lay.unusedFieldIds||[]).filter(id=>![IDS.fDec,IDS.fDef].includes(id));}
const r=await api('PUT','/modules/'+T+'/layouts/'+IDS.layout,{rowVersion:L.rowVersion,name:L.name,views:L.views,dependencies:L.dependencies||[]});
if(r.s<300)LED('layout QA RT9 2174 Layout: added fields qa_rt9_round, qa_rt9_default');
const g2=(await api('GET','/modules/'+T+'/layouts/'+IDS.layout)).j.data;
return {put:sh(r),onCreate:g2.views.CREATE.layout.sections[0].columns[0].fields.map(x=>x.fieldName).slice(-3),onDetail:g2.views.DETAIL.layout.sections[0].columns[0].fields.map(x=>x.fieldName).slice(-3),ts:g2.ticketStatuses};
