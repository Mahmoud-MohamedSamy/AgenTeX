const o={}; const mods=arr((await api('GET','/modules')).j.data); const L=mods.find(x=>x.moduleKey==='leads'); o.mid=L.id;
o.lays=arr((await api('GET','/modules/'+L.id+'/layouts')).j.data).map(x=>[x.id,x.name,x.isDefault||x.is_default]);
o.rules=arr((await api('GET','/modules/'+L.id+'/validation-rules')).j.data).map(x=>[x.id.slice(0,8),x.name,x.status,x.layoutId&&x.layoutId.slice(0,8),x.primaryField]);
o.f=arr((await api('GET','/modules/'+L.id+'/fields')).j.data).filter(x=>/name|company|qa_rt/.test(x.apiName||x.api_name||x.key||'')).map(x=>[(x.apiName||x.api_name||x.key),x.type||x.dataType||x.fieldType]);
return o;
