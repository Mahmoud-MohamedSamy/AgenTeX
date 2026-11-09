const fs=require('fs');const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-high/';
const save=(t,n,o)=>fs.writeFileSync(R+t+'/raw/'+n+'.json',JSON.stringify(o,null,1));
const out={};
const s=await api('GET','/desk/integrations/crm/status');out.status=s.s;
const mu=await api('GET','/desk/integrations/crm/mentionable-users?q=');save('ndc-2392','mentionable-users',mu.j);out.mention={s:mu.s,n:arr(mu.j&&mu.j.data).length,kinds:[...new Set(arr(mu.j&&mu.j.data).map(x=>x.kind))]};
const hist=await api('GET','/desk/integrations/crm/history');save('ndc-2392','history',hist.j);
const u=await api('GET','/iam/users?page_size=200&app_key=desk');save('ndc-2392','desk-users',{s:u.s,count:arr(u.j&&u.j.data).length,sample:arr(u.j&&u.j.data).slice(0,2).map(x=>Object.keys(x))});
const users=arr(u.j&&u.j.data);out.deskUsers={s:u.s,n:users.length,profiles:{}};for(const x of users){for(const p of (x.profiles||x.profile_names||[])){const n=p.name||p;out.deskUsers.profiles[n]=(out.deskUsers.profiles[n]||0)+1}}
const uc=await api('GET','/iam/users?page_size=200&app_key=crm');const cu=arr(uc.j&&uc.j.data);out.crmUsers={s:uc.s,n:cu.length};
const deskIds=new Set(users.map(x=>x.user_id||x.id));out.crmOnly=cu.filter(x=>!deskIds.has(x.user_id||x.id)).map(x=>({id:x.user_id||x.id,name:x.display_name}));
// hierarchy
for(const p of ['/settings/resolved?app_key=general&key=general.company.hierarchy.preference&scope_type=Org','/settings/history?app_key=general&key=general.company.hierarchy.preference&scope_type=Org','/iam/roles','/iam/hierarchy','/iam/sharing-rules','/settings/data-sharing','/iam/me/subordinates','/settings/roles']){const r=await api('GET',p);out[p]={s:r.s,t:r.t.slice(0,300)};}
const any=cu[0]&&(cu[0].user_id||cu[0].id);if(any){for(const p of ['/iam/users/'+any+'/subordinates','/iam/users/'+any]){const r=await api('GET',p);out[p.replace(any,'{id}')]=r.s;}}
const prof=await api('GET','/iam/profiles?app_key=crm');save('ndc-2417','profiles',prof.j);out.profiles=arr(prof.j&&prof.j.data).map(p=>(p.name)+'@'+p.rank+(p.parentProfileId||p.parent_profile_id?'':'(root)'));
return out;
