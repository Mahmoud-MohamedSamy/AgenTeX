eval(require('fs').readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-1865/functional/laneG/scripts/lib.js','utf8'));
const o={};
// layout for the throwaway dept, copied from the Standard layout
if(!IDS.layout){const src=await api('GET','/modules/'+T+'/layouts/0dabc9a3-c7f2-4f74-bd1b-9e21373a6c06');const L=src.j&&src.j.data;o.src=src.s;
 const r=await api('POST','/modules/'+T+'/layouts',{name:'QA FT 1865 Layout',views:L.views,dependencies:[],departmentIds:[IDS.D],description:'QA NDC-1865 functional - safe to delete'});o.layout=sh(r);const id=r.j&&r.j.data&&(r.j.data.id||r.j.data.layoutId);if(id){IDS.layout=id;LED('CREATED layout "QA FT 1865 Layout" '+id+' (dept QA FT 1865)');saveIds();}}
if(!IDS.fTxt){const r=await api('POST','/modules/'+T+'/fields',{fields:[
 {fieldName:'qa_ft1865_text',apiName:'qa_ft1865_text',labels:{en:'QA FT1865 Text'},datatypeKey:'single_line',datatypeOptions:{}},
 {fieldName:'qa_ft1865_pick',apiName:'qa_ft1865_pick',labels:{en:'QA FT1865 Pick'},datatypeKey:'pick_list',datatypeOptions:{allowed_values:['alpha','beta']}}]});o.fields=sh(r);
 const F=arr((await api('GET','/modules/'+T+'/fields')).j.data);for(const f of F){if(f.fieldName==='qa_ft1865_text'){IDS.fTxt=f.id;LED('CREATED field qa_ft1865_text '+f.id);}if(f.fieldName==='qa_ft1865_pick'){IDS.fPick=f.id;LED('CREATED field qa_ft1865_pick '+f.id);}}saveIds();}
const g=await api('GET','/modules/'+T+'/layouts/'+IDS.layout);const L=g.j.data;
const F=arr((await api('GET','/modules/'+T+'/fields')).j.data).filter(f=>[IDS.fTxt,IDS.fPick].includes(f.id));
const entry=f=>({id:f.id,apiName:f.apiName,fieldName:f.fieldName,labels:f.labels,datatypeKey:f.datatypeKey,config:{...f.config},datatypeOptions:f.datatypeOptions||{},isSystemField:false,isDeletable:true,isSystemManaged:false,fieldOrder:f.fieldOrder});
for(const v of ['CREATE','DETAIL']){const lay=L.views[v].layout;const col=lay.sections[0].columns[0];for(const f of F)if(!col.fields.some(x=>x.id===f.id))col.fields.push(entry(f));lay.unusedFieldIds=(lay.unusedFieldIds||[]).filter(id=>![IDS.fTxt,IDS.fPick].includes(id));}
const p=await api('PUT','/modules/'+T+'/layouts/'+IDS.layout,{rowVersion:L.rowVersion,name:L.name,views:L.views,dependencies:L.dependencies||[]});o.put=sh(p);if(p.s<300)LED('UPDATED layout: added the 2 QA fields');
const t=await mkTicket('QA FT 1865 F1 fields',{qa_ft1865_text:'hello 1865',qa_ft1865_pick:'beta'},'(F1)');o.ticket=t;
if(t.id){const x=await getT(t.id);o.read={text:x.qa_ft1865_text,pick:x.qa_ft1865_pick,dept:x.department,layout:x.layout||x.layout_id};}
const bad=await api('POST','/modules/'+T+'/records',body({subject:'QA FT 1865 F1 bad pick',department:IDS.D,status:'Open',priority:'Medium',qa_ft1865_pick:'gamma'}));o.badPick=sh(bad);const bid=bad.j&&bad.j.data&&bad.j.data.id;if(bid){LED('CREATED ticket (bad pick accepted!) '+bid);IDS.tickets.push(bid);saveIds();}
o.IDS=IDS;return o;
