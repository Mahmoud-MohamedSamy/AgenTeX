const g=await api('GET','/global-sets'); fs.writeFileSync(RUN+'/baseline/global-sets.json',JSON.stringify(g.j,null,1));
const m=arr((await api('GET','/modules')).j.data); const C=m.find(x=>x.moduleKey==='contacts'); I.L=L; I.C=C.id; SAVE();
for (const [k,id] of [['leads',L],['contacts',C.id]]) { const f=arr((await api('GET','/modules/'+id+'/fields')).j.data); fs.writeFileSync(RUN+'/baseline/fields-'+k+'.json',JSON.stringify(f.map(x=>({id:x.id,n:x.fieldName,t:x.datatypeKey,rv:x.rowVersion,gs:x.datatypeOptions&&x.datatypeOptions.global_set_id})),null,1)); }
return {sets:arr(g.j.data).length, contacts:C.id};
