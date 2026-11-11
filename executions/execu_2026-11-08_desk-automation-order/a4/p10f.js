const ACC='784400e1-4a2a-42c2-b4f3-7ca56e79828a';const r=await api('GET','/modules/'+ACC+'/fields');const f=arr2(r.j?.data);
return {s:r.s,keys:f[0]?Object.keys(f[0]).join(','):JSON.stringify(r.j?.data).slice(0,200),req:f.filter(x=>x.isRequired||x.is_required||x.required).map(x=>x.fieldName||x.apiName||x.name)};
