const out={}; const CEO='7972984b-b5cc-034a-bd96-6de61e3937d0', MGR='d46e0424-fd6f-914e-b4cf-f1597f7cbdcd';
for (const p of ['/iam/org-units/'+CEO+'/members','/iam/org-units/'+CEO+'/users','/iam/org-units/'+MGR+'/members','/iam/users?org_unit_id='+CEO]) { const r = await api('GET',p); out[p]=r.s+' '+JSON.stringify(arr(r.j&&r.j.data).map(x=>x.display_name||x.name||x.email||x.user_id||x.userId)).slice(0,300); }
return out;
