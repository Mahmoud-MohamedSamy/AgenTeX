const o={};
const lay=arr((await api('GET','/modules/'+L+'/layouts')).j.data); const std=lay.find(x=>/standard/i.test(x.name))||lay[0]; I.LAY=std.id; SAVE(); o.layout=std.name;
let r=await api('POST','/modules/'+L+'/views',{name:'QA GS1111 Silver view',kind:'list',layout_id:I.LAY,visibility:'private',settings:{columns:['first_name','last_name','qa_gs1111_tier'],sort:null,criteria:{pattern:null,conditions:[{field:'qa_gs1111_tier',operator:'equals',value:'Silver'}]},related_criteria:[]}});
o.view=SR(r); if(r.s<300){I.V=r.j.data.id;SAVE();LED('Leads view QA GS1111 Silver view '+I.V);}
const vr=await api('GET','/modules/'+L+'/views/'+I.V); o.viewCrit=JSON.stringify(vr.j&&vr.j.data&&vr.j.data.settings&&vr.j.data.settings.criteria);
r=await api('POST','/workflow/rules',{moduleId:L,appKey:'crm',layoutId:null,departmentIds:[],name:'QA GS1111 Bronze rule',description:'QA GS1111 - safe to delete',mode:'Recurring',isActive:false,
 trigger:{kind:'RecordCreated',fieldName:null,fieldNames:null,fieldMatch:null,dateFieldName:null,offsetSeconds:null,offsetMode:null},
 criteria:{kind:'Comparison',field:'qa_gs1111_tier',operator:'Equal',value:{kind:'string',stringValue:'Bronze'},negate:null},
 actions:[{type:'FieldUpdate',order:0,delaySeconds:0,fieldUpdates:{qa_gs1111_tier:{kind:'string',stringValue:'Silver'}}}]});
o.rule=SR(r)+' '+(r.s>=300?r.t.slice(0,300):''); if(r.s<300){I.W=r.j.data.id;SAVE();LED('workflow rule QA GS1111 Bronze rule (inactive) '+I.W);}
const u=await api('GET','/global-sets/'+I.T+'/used-in'); o.usedIn=JSON.stringify(u.j.data).slice(0,1500);
return o;
