const mods=arr((await api('GET','/modules')).j.data); const o={};
for(const m of mods){const f=arr((await api('GET','/modules/'+m.id+'/fields')).j.data).find(x=>(x.fieldName||x.apiName)==='score'); o[m.moduleKey]=f?{dt:f.datatypeKey,sys:f.isSystemManaged,ro:f.isReadOnly,vis:f.isVisible, keys:Object.keys(f).join(',')}:null;}
return o;
