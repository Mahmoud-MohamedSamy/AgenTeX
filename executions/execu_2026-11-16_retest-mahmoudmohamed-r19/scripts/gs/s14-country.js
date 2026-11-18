const o={}; const mods=arr((await api('GET','/modules')).j.data); const km=m=>m.apiName||m.api_name||m.key||m.name;
for (const k of ['leads','contacts','accounts','deals']) { const m=mods.find(x=>km(x)===k); const f=arr((await api('GET','/modules/'+m.id+'/fields')).j.data); if(k==='leads') o.keys=Object.keys(f[0]).join(',');
 o[k]=f.filter(x=>/source|industry|country|state/i.test(x.fieldName||x.field_name||x.apiName||'')).map(x=>(x.fieldName||x.field_name)+':'+(x.datatypeKey||x.datatype_key||x.dataType)+':'+JSON.stringify(x.datatypeOptions||{}).slice(0,80)).join(' ; '); }
return o;
