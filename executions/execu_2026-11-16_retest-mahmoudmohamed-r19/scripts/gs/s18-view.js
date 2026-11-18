const o={};
for (const sort of [{field:'qa_rt19_gs_tier',direction:'asc'},{field:'qa_rt19_gs_tier',order:'asc'},null]) {
 const r=await api('POST','/modules/'+L+'/views',{name:'QA RT19 GS Sort view',kind:'list',layout_id:I.LAY,visibility:'private',settings:{columns:['first_name','last_name','qa_rt19_gs_tier'],sort,criteria:{pattern:null,conditions:[{field:'first_name',operator:'equals',value:'QA RT19 GS'}]},related_criteria:[]}});
 o['try '+JSON.stringify(sort)]=SR(r)+' '+(r.s>=300?JSON.stringify(r.j&&r.j.error&&r.j.error.details).slice(0,200):''); if(r.s<300){ I.V2=r.j.data.id; LED('Leads view QA RT19 GS Sort view '+I.V2); SAVE(); o.saved=JSON.stringify(r.j.data.settings.sort); break; } }
return o;
