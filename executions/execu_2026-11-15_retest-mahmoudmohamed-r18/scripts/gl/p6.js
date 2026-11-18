const o={};
o.ds=(await api('GET','/desk/data-sharing')).t.slice(0,1500);
o.ta=(await api('GET','/desk/ticket-access/settings')).t.slice(0,800);
const ul=arr((await api('GET','/iam/users?limit=200')).j.data);
const pick=u=>({id:u.userId||u.id, label:/^fedelav803@/i.test(u.email||'')?'C':/^mahmoud\.mahamed1515@/i.test(u.email||'')?'B':'?', status:u.status, profile:u.profile_name||u.profileName||(u.profile&&u.profile.name), role:u.role_name||u.roleName||(u.role&&u.role.name), keys:Object.keys(u).join(',').slice(0,300)});
o.users=ul.filter(u=>/^(fedelav803|mahmoud\.mahamed1515)@/i.test(u.email||'')).map(pick);
return o;
