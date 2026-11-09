eval(require('fs').readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-backlog/scripts/lib.js','utf8'));
const o={};const CM='43004ce2-577f-4eda-b00a-0750fe40c3d4';
if(!IDS.fPick){const r=await api('POST','/modules/'+T+'/fields',{fields:[
 {fieldName:'qa_rt9_pick',apiName:'qa_rt9_pick',labels:{en:'QA RT9 Pick'},datatypeKey:'pick_list',datatypeOptions:{allowed_values:['zeta']}},
 {fieldName:'qa_rt9_contact',apiName:'qa_rt9_contact',labels:{en:'QA RT9 Contact'},datatypeKey:'lookup',datatypeOptions:{target_module_id:CM,display_field:'first_name'}}]});o.create=sh(r);
 const F=arr((await api('GET','/modules/'+T+'/fields')).j.data);for(const f of F){if(f.fieldName==='qa_rt9_pick'){IDS.fPick=f.id;LED('field qa_rt9_pick '+f.id);}if(f.fieldName==='qa_rt9_contact'){IDS.fLk=f.id;LED('field qa_rt9_contact '+f.id);}}saveIds();}
const g=await api('GET','/modules/'+T+'/layouts/'+IDS.layout);const L=g.j.data;
const F=arr((await api('GET','/modules/'+T+'/fields')).j.data).filter(f=>[IDS.fPick,IDS.fLk].includes(f.id));
const entry=f=>({id:f.id,apiName:f.apiName,fieldName:f.fieldName,labels:f.labels,datatypeKey:f.datatypeKey,config:{...f.config},datatypeOptions:f.datatypeOptions||{},isSystemField:false,isDeletable:true,isSystemManaged:false,fieldOrder:f.fieldOrder});
for(const v of ['CREATE','DETAIL']){const lay=L.views[v].layout;const col=lay.sections[0].columns[0];for(const f of F)if(!col.fields.some(x=>x.id===f.id))col.fields.push(entry(f));lay.unusedFieldIds=(lay.unusedFieldIds||[]).filter(id=>![IDS.fPick,IDS.fLk].includes(id));}
const r=await api('PUT','/modules/'+T+'/layouts/'+IDS.layout,{rowVersion:L.rowVersion,name:L.name,views:L.views,dependencies:L.dependencies||[]});o.put=r.s;if(r.s<300)LED('layout: added qa_rt9_pick, qa_rt9_contact');
// contacts for the filter test
const cr=await api('POST','/modules/'+CM+'/records/query',{page:1,page_size:200});o.cq=cr.s;
let C=arr(cr.j&&cr.j.data);if(!C.length){const c2=await api('GET','/modules/'+CM+'/records?page_size=200');o.cg=c2.s;C=arr(c2.j&&c2.j.data);}
const CC=C.map(fl);o.nContacts=CC.length;o.sample=CC.slice(0,8).map(c=>c.first_name+' | '+c.last_name+' | '+c.email);
o.IDS=IDS;return o;
