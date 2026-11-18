const o={}; const C='9d182dfa-05f3-4af7-9685-8615a2fbe537', B='3445ec4a-020e-4f12-b156-dd2de7610164';
const ul=arr((await api('GET','/iam/users?limit=200')).j.data);
for (const [k,id] of [['C',C],['B',B]]) { const u=ul.find(x=>x.userId===id); o[k]={orgUnit:u.orgUnitId, profiles:u.profileNames, mgr:u.reportingManagerId, name:u.displayName}; }
const roles=await api('GET','/iam/roles?app_key=desk'); o.roles=JSON.stringify(arr(roles.j.data).map(r=>[r.id,r.name,r.parentId||r.parent_id||r.reportsTo])).slice(0,1500);
for (const d of [['CS','7e1ac409-58b0-41ab-97e1-0e7d5c8c5158'],['MK','2a73bbc0-efb3-4250-bf9b-2fdc98236794']]) { const a=await api('GET','/desk/departments/'+d[1]+'/agents?limit=100'); o[d[0]+'agents']=arr(a.j.data).map(x=>x.user_id||x.userId||x.id).filter(x=>[B,C].includes(x)).map(x=>x===B?'B':'C'); }
const reqs=[]; 
return o;
