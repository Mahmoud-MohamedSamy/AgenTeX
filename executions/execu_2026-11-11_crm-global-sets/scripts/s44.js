const l=(await api('GET','/modules/'+L+'/layouts/'+I.LAY)).j.data; const on=JSON.stringify(l.views).includes('qa_gs1111_r2');
const u=await api('GET','/global-sets/'+I.T2+'/used-in'); const e=u.j.data.fields.find(x=>x.field.field_id===I.fR2);
if(on) LED('Leads Standard layout now holds qa_gs1111_r2 (rv '+l.rowVersion+') — removed when the field is deleted');
return {rv:l.rowVersion, onLayout:on, usedInLayouts:e&&e.layouts};
