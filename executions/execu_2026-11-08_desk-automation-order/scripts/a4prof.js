const o={};const U=arr((await api('GET','/iam/users?limit=200')).j?.data);
for(const id of ['876ce871-2b02-4854-89a7-68050391c62b','5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4']){const u=U.find(x=>x.id===id)||{};o[id.slice(0,8)]=[u.display_name,u.profile_id||u.profileId,u.profile_name||u.profileName];}
const P=arr((await api('GET','/iam/profiles?limit=100')).j?.data);o.profiles=P.map(p=>[p.id&&p.id.slice(0,8),p.name,(p.permissions||p.permission_keys||[]).filter(x=>/workflow/.test(typeof x==='string'?x:x.key)).map(x=>typeof x==='string'?x:x.key).join(',')]).filter(x=>x[1]);
return o;
