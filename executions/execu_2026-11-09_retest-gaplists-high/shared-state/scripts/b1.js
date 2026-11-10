const out={};
const names=['Dev Team 2','Customer Experience Specialists 2','Customer Experience Specialists 1','Mahmoud TAVIPortal','Test User 1','QA Team 1','Mahmoud TAVI','ndc-staging-owner','mahmoud.mahamed1515','Mahmoud Samy','Test User 2'];
const all=arr((await api('GET','/iam/users')).j.data);
out.accts=all.filter(u=>names.includes(u.displayName)).map(u=>({n:u.displayName,st:u.status,ou:u.orgUnitId&&u.orgUnitId.slice(0,8),prof:u.profileNames,mgr:u.reportingManagerId&&u.reportingManagerId.slice(0,8),id:u.userId.slice(0,8)}));
for(const p of ['/iam/org-units','/iam/orgunits','/iam/profiles','/iam/hierarchy-preference','/iam/settings/hierarchy','/iam/me/subordinates']){const r=await api('GET',p);out[p]=r.s+' '+(r.s===200?JSON.stringify(arr(r.j.data!==undefined?r.j.data:r.j).map(x=>({n:x.name,id:(x.id||x.orgUnitId||'').slice(0,8),r:x.rank,p:(x.parentId||x.parent_id||'').slice(0,8),app:x.app||x.appKey}))).slice(0,1500):r.t.slice(0,200));}
return out;
