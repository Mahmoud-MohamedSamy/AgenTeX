const id=I.ruleG; const g=await api('GET','/scoring-rules/'+id);
const p=await api('PUT','/scoring-rules/'+id,{name:'hacked',is_active:true,entries:[ent('lead_source','eq','web',1)],row_version:1});
const a=await api('PATCH','/scoring-rules/'+id+'/active',{is_active:false}); const d=await api('DELETE','/scoring-rules/'+id);
return {get:g.s,put:p.s,patch:a.s,del:d.s};
