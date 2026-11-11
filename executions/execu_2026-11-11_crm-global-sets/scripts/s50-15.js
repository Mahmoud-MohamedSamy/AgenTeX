let r=await api('POST','/global-sets',{name:'QA GS1111 R3 Many',values:[{label:'A'},{label:'B'},{label:'C'}]}); I.M=r.j.data.id; LED('set R3 Many '+I.M); I.MF=[]; SAVE();
for(let i=1;i<=16;i++){ const n='qa_gs1111_m'+i; const x=await api('POST','/modules/'+L+'/fields',{fields:[{fieldName:n,labels:{en:'QA GS1111 M'+i},datatypeKey:'pick_list',datatypeOptions:{allowed_values:['A','B','C']},config:{allowed_values:['A','B','C']}}]}); const d=x.j&&x.j.data; const id=d&&(Array.isArray(d)?d[0].id:(d.fields?d.fields[0].id:d.id)); if(!id) return 'field '+i+' '+SR(x); I.MF.push(id); LED('field '+n+' '+id); const a=await api('POST','/global-sets/'+I.M+'/associate',{module_id:L,field_id:id,mappings:{}}); if(a.s>=300) return 'assoc '+i+' '+SR(a); }
SAVE();
const g=await gs(I.M); const del=await api('DELETE','/global-sets/'+I.M); const rep=await api('POST','/global-sets/'+I.M+'/values/replace',{replacements:{A:'B'}}); const rem=await api('POST','/global-sets/'+I.M+'/values/remove',{values:['C']}); const add=await api('PUT','/global-sets/'+I.M,{name:g.name,description:g.description,colors_enabled:false,values:g.values.concat([{label:'D'}]),row_version:g.row_version});
RES('G6', rep.s===409?'Pass':'Fail','set linked to '+g.field_count+' fields: replace A→B → '+SR(rep)+' (Zoho: no replace above 15)');
RES('H7', del.s===409?'Pass':'Fail','delete set with '+g.field_count+' fields → '+SR(del)+' (Zoho: no delete above 15)');
RES('G6b','Info','with 16 fields: remove C to Unused → '+SR(rem)+'; add value D → '+SR(add)+' (Zoho: only 50 values per request move to used above 15; adding one value allowed)');
await api('POST','/global-sets/'+I.M+'/disassociate',{module_id:L,field_id:I.MF[15]});
const g15=await gs(I.M); const rep15=await api('POST','/global-sets/'+I.M+'/values/replace',{replacements:{A:'B'}});
RES('G6c', rep15.s===200?'Pass':'Fail','after one field removed ('+g15.field_count+' fields) replace A→B → '+SR(rep15)+' (limit is "more than 15")');
return {fields:g.field_count};
