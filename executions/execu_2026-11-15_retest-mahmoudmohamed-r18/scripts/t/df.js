const ms=arr((await api('GET','/modules')).j.data); const t=ms.find(m=>/^tickets?$/i.test(m.apiName||m.api_name||m.key||m.name||'')); const o={mods:ms.slice(0,12).map(m=>(m.apiName||m.api_name||m.key||m.name)+':'+m.id)};
if(t){ const f=arr((await api('GET','/modules/'+t.id+'/fields')).j.data); o.n=f.length; o.picks=f.filter(x=>/pick|select|check|bool|user|lookup/i.test(x.datatypeKey||x.datatype_key||'')).map(x=>(x.labels&&x.labels.en||x.fieldName)+'='+(x.datatypeKey||x.datatype_key)); }
return o;
