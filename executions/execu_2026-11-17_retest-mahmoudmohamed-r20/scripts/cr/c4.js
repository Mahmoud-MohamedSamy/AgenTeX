eval(fs.readFileSync('cr/lib.js','utf8'));const CU='6f553963-01d6-4b68-9fb3-143d23044c41';
const f=arr((await api('GET',`/modules/${CU}/fields?take=400`)).j?.data);
return {req:f.filter(x=>x.required&&x.status==='active').map(x=>[x.apiName,x.labels?.en,x.datatypeKey,x.isSystemManaged]),layouts:arr((await api('GET',`/modules/${CU}/layouts`)).j?.data).filter(l=>l.isDefault).map(l=>[l.id,l.name])};
