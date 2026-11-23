const C='f7e488b5-0232-42fd-811c-1f24356af653';const o={};
for(const p of ['/modules/'+C+'/fields','/modules/'+C]){const x=await api('GET',p);const L=arr(x.j?.data)||[];o[p]=x.s+' '+(L.length?JSON.stringify(L.filter(f=>f.isRequired||f.required||f.is_required||/subject|status|contact|department|owner|start/i.test(f.apiName||f.name||f.key)).map(f=>[f.apiName||f.key||f.name,f.label||f.displayName,f.dataType||f.type,f.isRequired??f.required??f.is_required,f.isSystem])):x.t.slice(0,600));}
const mods=arr((await api('GET','/modules?take=200')).j?.data);o.contacts=JSON.stringify(mods.filter(m=>/contact/i.test(m.name||m.apiName)).map(m=>[m.id,m.name,m.apiName]));
return o;
