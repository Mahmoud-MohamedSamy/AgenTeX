const g=await gs(I.T); const f=await fieldOf(L,I.fMap);
const up=await api('PATCH','/modules/'+L+'/records/'+I.Lmap,rec({last_name:'Lmap Copper edited'}));
const up2=await api('PUT','/modules/'+L+'/records/'+I.Lmap,rec({last_name:'Lmap Copper edited'}));
const p=await api('GET','/global-sets/'+I.T+'/association-preview?module_id='+L+'&field_id='+I.fMap);
return {setValues:g.values.map(v=>v.value), unused:g.unused_values.map(v=>v.value), fieldAllowed:f.datatypeOptions.allowed_values, record:await recVal(L,I.Lmap,'qa_gs1111_map'), patch:SR(up), put:SR(up2), previewNow:JSON.stringify(p.j&&p.j.data&&p.j.data.local_values)};
