const u=arr((await api('GET','/iam/users?take=200')).j?.data).filter(x=>x.status==='active'&&!/^Associate/.test(x.profileNames||''));
log(JSON.stringify(u.map(x=>[x.userId,x.displayName,x.profileNames,x.orgUnitId])));
const ou=arr((await api('GET','/iam/org-units?take=200')).j?.data); log('ou',ou.length,ou[0]?Object.keys(ou[0]).join(','):''); log(JSON.stringify(ou.map(x=>[x.id,x.name,x.kind||x.type,x.parentId]).slice(0,60)));
const ag=await api('GET','/desk/agents?take=200'); const A=arr(ag.j?.data); log('agents',ag.s,A.length,A[0]?Object.keys(A[0]).join(','):ag.t.slice(0,200));
