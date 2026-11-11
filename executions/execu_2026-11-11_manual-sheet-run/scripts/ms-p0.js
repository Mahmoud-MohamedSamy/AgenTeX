// Read-only probe: departments, agents (name, profile/role, departments), ticket templates, contacts named QA MAN.
module.exports=async()=>{const R={};
 const d=await api('GET','/desk/departments');R.depts=arr(d.j&&d.j.data).map(x=>({id:x.id,name:x.name,active:x.is_active}));
 const a=await api('GET','/desk/agents?per_page=200');R.agentsStatus=a.s;const al=arr(a.j&&a.j.data);
 R.agentKeys=al[0]?Object.keys(al[0]):[];
 R.agents=al.map(x=>({id:x.id,user_id:x.user_id,name:x.name||x.display_name||[x.first_name,x.last_name].join(' '),role:x.role&&(x.role.name||x.role),profile:x.profile&&(x.profile.name||x.profile),depts:(x.departments||x.department_ids||[]).map(y=>y.name||y),status:x.status}));
 const u=await api('GET','/iam/users?per_page=500');const ul=arr(u.j&&u.j.data);R.userKeys=ul[0]?Object.keys(ul[0]):[];
 R.users=ul.map(x=>({id:x.id,name:x.display_name||x.name||[x.first_name,x.last_name].join(' '),email:String(x.email||'').replace(/^(.{2}).*@/,'$1***@'),role:x.role&&(x.role.name||x.role),profiles:x.profiles||x.app_profiles||undefined}));
 return R;};
