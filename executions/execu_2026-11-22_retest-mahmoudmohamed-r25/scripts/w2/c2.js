const us=arr((await api('GET','/iam/users?take=300&app_key=desk')).j?.data);
log(us.filter(u=>/Customer Experience|Mahmoud Mohamed|Dev Team 2|Test User 1/.test(u.displayName)).map(u=>[u.displayName,u.orgUnitId,u.status,u.profileNames]));
log('CEO members', us.filter(u=>u.orgUnitId==='7972984b-b5cc-034a-bd96-6de61e3937d0').map(u=>u.displayName));
for (const p of ['/desk/departments/7e1ac409-58b0-41ab-97e1-0e7d5c8c5158','/desk/agents?department_id=7e1ac409-58b0-41ab-97e1-0e7d5c8c5158','/desk/agents']) { const r=await api('GET',p); log(p,r.s,r.t.slice(0,1200)); }
