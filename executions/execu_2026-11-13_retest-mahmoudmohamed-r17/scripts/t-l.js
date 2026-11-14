const v=(await api('GET','/modules/'+L+'/views/'+I.V67)).j.data; const lr=await api('GET','/modules/'+L+'/records?view_id='+I.V67+'&limit=50');
const ids=arr(lr.j&&lr.j.data).map(x=>x.id); const vals=[]; for(const id of ids) vals.push(await recVal(L,id,'qa_rt17_cv'));
return {crit:JSON.stringify(v.settings.criteria.conditions), rows:ids.length, vals};
