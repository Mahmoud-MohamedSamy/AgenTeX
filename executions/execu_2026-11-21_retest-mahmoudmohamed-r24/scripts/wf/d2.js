const o={};
const L=arr((await api('GET','/iam/org-units?app_key=desk')).j?.data);o.units=L.map(x=>[x.name,x.orgUnitId]);
const us=arr((await api('GET','/iam/users?take=300&app_key=desk')).j?.data);const m={};for(const u of us){const k=L.find(x=>x.orgUnitId===u.orgUnitId)?.name||String(u.orgUnitId).slice(0,8);(m[k]=m[k]||[]).push(u.displayName);}o.byUnit=m;
for(const x of L){const r=await api('GET','/iam/org-units/'+x.orgUnitId+'/users?app_key=desk');o[x.name]=r.s+' '+JSON.stringify(arr(r.j?.data).map(u=>u.displayName||u.userId)).slice(0,500);}
return o;
