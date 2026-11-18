const C='f7e488b5-0232-42fd-811c-1f24356af653';const o={};
const F=arr((await api('GET','/modules/'+C+'/fields')).j?.data);const cs=F.find(f=>(f.apiName||f.key)==='call_status');o.cs=JSON.stringify(cs).slice(0,900);
const ct=F.find(f=>(f.apiName||f.key)==='contact_id');o.ct=JSON.stringify(ct).slice(0,400);
const c=await api('GET','/modules/43004ce2-577f-4eda-b00a-0750fe40c3d4/records?take=5&search=QA');o.contacts=c.s+' '+JSON.stringify(arr(c.j?.data).map(r=>[r.id,(r.data||[]).filter(x=>/name/.test(x.field)).map(x=>x.value?.value)]));
return o;
