let r=await api('POST','/global-sets',{name:'QA GS1111 R2',colors_enabled:true,values:[{label:'Gold',color:'#d4a017'},{label:'Silver',color:'#9aa4b2'},{label:'Bronze',color:'#b06a3b'}]}); I.T2=r.j.data.id; LED('set QA GS1111 R2 '+I.T2);
r=await api('POST','/modules/'+L+'/fields',{fields:[{fieldName:'qa_gs1111_r2',labels:{en:'QA GS1111 R2'},datatypeKey:'pick_list',datatypeOptions:{allowed_values:['Gold','Silver','Bronze']},config:{allowed_values:['Gold','Silver','Bronze']}}]}); const d=r.j.data; I.fR2=Array.isArray(d)?d[0].id:(d.fields?d.fields[0].id:d.id); LED('field qa_gs1111_r2 '+I.fR2);
const a=await api('POST','/global-sets/'+I.T2+'/associate',{module_id:L,field_id:I.fR2,mappings:{}});
I.R2=[]; for (const v of ['Gold','Silver','Bronze']) { const x=await api('POST','/modules/'+L+'/records',rec({first_name:'QA GS1111',last_name:'R2 '+v,qa_gs1111_r2:v})); const id=x.j.data.id||x.j.data.record.id; I.R2.push(id); LED('record R2 '+v+' '+id); }
await api('POST','/global-sets/'+I.T2+'/values/remove',{values:['Bronze']}); SAVE();
return {assoc:SR(a), recs:I.R2.length, set:(await gs(I.T2)).values.map(v=>v.value)+' | unused '+(await gs(I.T2)).unused_values.map(v=>v.value)};
