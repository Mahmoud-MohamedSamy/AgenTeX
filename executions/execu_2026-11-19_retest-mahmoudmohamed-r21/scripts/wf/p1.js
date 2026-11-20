const d=arr((await api('GET','/desk/departments?take=200&search=RT19')).j?.data); log('rt19 depts',JSON.stringify(d.map(x=>[x.id,x.name])));
const u=arr((await api('GET','/iam/users?take=200')).j?.data); log('users',u.length, u[0]?Object.keys(u[0]).join(','):'');
log(JSON.stringify(u.map(x=>[x.userId.slice(0,8),x.displayName,x.status,x.profileNames,x.roleName||x.roleNames||x.roleId])));
