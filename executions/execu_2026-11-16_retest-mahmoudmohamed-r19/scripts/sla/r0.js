const u=arr((await api('GET','/iam/users?take=200')).j?.data);
log('users',u.length, JSON.stringify(u.filter(x=>/samy|test user|ces|dev team|zz|owner/i.test(x.displayName||'')).map(x=>[x.userId,x.displayName,x.status,x.profileNames])));
const d=arr((await api('GET','/desk/departments?take=200&search=RT19')).j?.data); log('rt19 depts',JSON.stringify(d.map(x=>[x.id,x.name])));
for(const p of ['/desk/sla/meta','/desk/ticket-access','/desk/settings/ticket-access','/desk/email-templates?take=5','/desk/sla/policies?take=2']){const x=await api('GET',p);log(p,x.s,x.t.slice(0,700));}
