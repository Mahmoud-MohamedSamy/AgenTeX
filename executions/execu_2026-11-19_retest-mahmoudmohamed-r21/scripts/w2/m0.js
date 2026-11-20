const ms=arr((await api('GET','/modules?take=200')).j?.data);
const o={mods:ms.map(m=>m.id+' '+(m.apiName||m.key||m.name)).slice(0,40)};
for(const m of ms.filter(m=>/^(leads|accounts|deals|contacts)$/i.test(m.apiName||m.key||m.name||''))){
 const f=await api('GET',`/modules/${m.id}/fields?take=500`);const fs_=arr(f.j?.data).length?arr(f.j?.data):(f.j?.data?.fields||[]);
 o[m.apiName||m.name]=fs_.filter(x=>/picklist|select|enum|list/i.test(x.type||x.dataType||x.fieldType||'')).map(x=>`${x.apiName||x.key||x.name}[${(x.type||x.dataType||x.fieldType)}]: ${JSON.stringify((x.options||x.picklistValues||x.config?.options||[]).slice(0,6).map(p=>(p.value??p.key)+'='+(p.label??p.displayValue??'')))}`);
 if(!fs_.length)o[m.apiName||m.name]=f.s+' '+f.t.slice(0,300);
}
return o;
