const fs=require('fs');const creds=JSON.parse(fs.readFileSync(process.env.CREDS,'utf8'));
const u=(await api('GET','/iam/users?per_page=500')).j; const U=arr(u.data); const out={keys:Object.keys(U[0]||{})};
out.acc=creds.map((c,i)=>{const x=U.find(x=>JSON.stringify(x).toLowerCase().includes('"'+c.user.toLowerCase()+'"'));return x?{i,name:c.name,id:x.id||x.user_id,status:x.status,profile:x.profile_name||x.profile||x.role_name||(x.profile&&x.profile.name),roles:JSON.stringify(x.roles||x.app_roles||x.apps||'').slice(0,200)}:{i,name:c.name,missing:true}});
const t=await api('GET','/desk/tickets?per_page=2'); out.ticketsShape=t.s+' '+t.t.slice(0,800);
const pq=await api('POST','/desk/agents/presence/query',{user_ids:out.acc.map(a=>a.id).filter(Boolean)}); out.presence=pq.s+' '+pq.t.slice(0,800);
return out;
