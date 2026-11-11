const fl=arr((await api('GET','/modules/'+L+'/fields')).j.data); const f=fl.find(x=>/qa_gs1111_new|pick_list_6/i.test(x.fieldName)); if(!f) return 'no new field';
I.fNew=f.id; SAVE(); LED('field '+f.fieldName+' (layout editor, Leads Standard) '+f.id);
const g=await gs(I.T); const linked=g.fields.some(x=>x.field_id===f.id);
RES('I1', linked?'Pass':'Fail','new pick list field from the layout editor with "Use a global set" = Tier → field '+f.fieldName+' allowed '+f.datatypeOptions.allowed_values+' gs='+f.datatypeOptions.global_set_id+'; set lists it: '+linked);
const u=await api('GET','/global-sets/'+I.T+'/used-in'); const e=u.j.data.fields.find(x=>x.field.field_id===f.id); RES('J3', e&&e.layouts.length?'Pass':'Fail','Used In layouts for the new field: '+JSON.stringify(e&&e.layouts));
return {n:f.fieldName};
