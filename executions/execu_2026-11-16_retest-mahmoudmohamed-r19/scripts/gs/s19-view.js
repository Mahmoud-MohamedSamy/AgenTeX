const v=(await api('GET','/modules/'+L+'/views/'+I.V2)).j.data; const s={...v.settings, sort:{field:'qa_rt19_gs_tier',dir:'asc'}};
const r=await api('PATCH','/modules/'+L+'/views/'+I.V2,{settings:s}); let out=SR(r);
if(r.s>=300){ const r2=await api('PUT','/modules/'+L+'/views/'+I.V2,{name:v.name,kind:v.kind,layout_id:v.layout_id,visibility:v.visibility,settings:s}); out+=' / PUT '+SR(r2); }
const v2=(await api('GET','/modules/'+L+'/views/'+I.V2)).j.data; return out+' sort now '+JSON.stringify(v2.settings.sort)+' crit '+JSON.stringify(v2.settings.criteria);
