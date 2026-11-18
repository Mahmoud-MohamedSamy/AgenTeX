const o={};
const mods=arr((await api('GET','/modules')).j.data); const km=m=>m.apiName||m.api_name||m.key||m.name; I.C=mods.find(m=>km(m)==='contacts').id; SAVE();
let r=await api('POST','/global-sets',{name:'QA RT19 GS Tier',description:'QA RT19 GS - safe to delete',values:[{label:'Gold'},{label:'Silver'},{label:'Bronze'},{label:'Platinum'}]}); o.set=SR(r); I.T=r.j&&r.j.data&&r.j.data.id; if(I.T) LED('set QA RT19 GS Tier '+I.T); SAVE();
const fL=await mkSetF(L,'qa_rt19_gs_tier',I.T,'QA RT19 GS Tier'); const fC=await mkSetF(I.C,'qa_rt19_gs_tier',I.T,'QA RT19 GS Tier'); I.fL=fL.id; I.fC=fC.id; o.fL=fL.s+' '+fL.e; o.fC=fC.s+' '+fC.e;
// dependent child field (local)
r=await api('POST','/modules/'+L+'/fields',{fields:[{fieldName:'qa_rt19_gs_dc',labels:{en:'QA RT19 GS Child'},datatypeKey:'pick_list',datatypeOptions:{allowed_values:['X','Y','Z']},config:{allowed_values:['X','Y','Z']}}]}); { const d=r.j&&r.j.data; I.fDC=d&&(Array.isArray(d)?d[0].id:(d.fields?d.fields[0].id:d.id)); if(I.fDC) LED('field qa_rt19_gs_dc '+I.fDC+' (Leads, local X/Y/Z)'); o.fDC=SR(r);} SAVE();
r=await api('POST','/modules/'+L+'/dependency-maps',{controllingFieldId:I.fL,dependentFieldId:I.fDC,valueMap:{Gold:['X'],Silver:['Y']}}); o.map=SR(r); I.MAP=r.j&&r.j.data&&r.j.data.id; if(I.MAP) LED('dependency map tier→child '+I.MAP); SAVE();
I.R={}; for (const [k,m,v] of [['LG1',L,{qa_rt19_gs_tier:'Gold',qa_rt19_gs_dc:'X'}],['LG2',L,{qa_rt19_gs_tier:'Gold'}],['LS1',L,{qa_rt19_gs_tier:'Silver',qa_rt19_gs_dc:'Y'}],['CG1',I.C,{qa_rt19_gs_tier:'Gold'}]]) { const x=await mkRec(m,'Tier '+k,v); I.R[k]=x[1]; o['rec_'+k]=x[0]+' '+x[2]; } SAVE();
const lay=arr((await api('GET','/modules/'+L+'/layouts')).j.data); const std=lay.find(x=>/standard/i.test(x.name))||lay[0]; I.LAY=std.id;
r=await api('POST','/modules/'+L+'/views',{name:'QA RT19 GS Gold view',kind:'list',layout_id:I.LAY,visibility:'private',settings:{columns:['first_name','last_name','qa_rt19_gs_tier'],sort:null,criteria:{pattern:null,conditions:[{field:'qa_rt19_gs_tier',operator:'equals',value:'Gold'}]},related_criteria:[]}});
o.view=SR(r); if(r.s<300){I.V=r.j.data.id;LED('Leads view QA RT19 GS Gold view '+I.V);} SAVE();
r=await api('POST','/workflow/rules',{moduleId:L,appKey:'crm',layoutId:null,departmentIds:[],name:'QA RT19 GS Gold rule',description:'QA RT19 GS - safe to delete',mode:'Recurring',isActive:false,
 trigger:{kind:'RecordCreated',fieldName:null,fieldNames:null,fieldMatch:null,dateFieldName:null,offsetSeconds:null,offsetMode:null},
 criteria:{kind:'Comparison',field:'qa_rt19_gs_tier',operator:'Equal',value:{kind:'string',stringValue:'Gold'},negate:null},
 actions:[{type:'FieldUpdate',order:0,delaySeconds:0,fieldUpdates:{qa_rt19_gs_tier:{kind:'string',stringValue:'Gold'}}}]});
o.rule=SR(r); if(r.s<300){I.W=r.j.data.id;LED('workflow rule QA RT19 GS Gold rule '+I.W+' isActive='+r.j.data.isActive);} SAVE();
const ds=arr((await api('GET','/reporting/semantic-layer/datasets')).j.data.data).find(x=>x.module_key==='leads'); I.DS=ds.id;
const dim=k=>({dataset_id:I.DS,field_key:k,grain:null});
r=await api('POST','/reporting/reports',{name:'QA RT19 GS Gold report',folder_id:null,query_spec:{ir_version:14,base_dataset_id:I.DS,dimensions:[dim('last_name'),dim('qa_rt19_gs_tier')],measures:[],filters:[{dataset_id:I.DS,field_key:'qa_rt19_gs_tier',operator:'eq',value:'Gold'}],sort:[],limit:100},viz_spec:{report_type:'tabular',config:{}}});
o.report=SR(r); I.REP=r.j&&r.j.data&&(r.j.data.data||r.j.data).id; if(I.REP) LED('report QA RT19 GS Gold report '+I.REP); SAVE();
await sleep(3000); const q=await api('POST','/reporting/reports/'+I.REP+'/query',{}); o.reportRows=SR(q)+' '+(q.t.match(/Tier (LG1|LG2|LS1)/g)||[]).join(',');
const u=await api('GET','/global-sets/'+I.T+'/used-in'); o.usedIn=JSON.stringify(u.j.data).replace(/"(module_id|field_id)":"[^"]+",/g,'').slice(0,2000);
return o;
