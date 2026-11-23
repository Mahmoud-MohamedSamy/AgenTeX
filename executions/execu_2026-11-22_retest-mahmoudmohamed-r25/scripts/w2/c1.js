const us=arr((await api('GET','/iam/users?take=300&app_key=desk')).j?.data);
const pick=us.filter(u=>/Customer Experience|Mahmoud Mohamed|Dev Team 2|Test User 1/.test(u.displayName)).map(u=>({n:u.displayName,id:u.userId,role:u.roleId||u.role_id||u.roleName||u.role,keys:Object.keys(u).join(',')}));
log(pick);
const ag=await api('GET','/desk/departments/7e1ac409-58b0-41ab-97e1-0e7d5c8c5158/agents'); log('CS agents',ag.s,ag.t.slice(0,1500));
const r=await api('GET','/iam/roles/7972984b-b5cc-034a-bd96-6de61e3937d0'); log('CEO',r.s,r.t.slice(0,800));
