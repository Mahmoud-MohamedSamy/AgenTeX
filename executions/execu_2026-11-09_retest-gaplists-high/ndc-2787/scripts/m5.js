const out={};
const u=await api('GET','/iam/users');const rows=arr(u.j);out.base={s:u.s,n:rows.length,keys:Object.keys(u.j||{}).slice(0,8),meta:u.j&&u.j.meta,statuses:rows.reduce((a,r)=>{const k=r.status||r.state||'?';a[k]=(a[k]||0)+1;return a},{})};
for(const p of ['/iam/users/count','/iam/users/summary','/iam/users/stats','/iam/licenses','/iam/seats','/iam/users?pageSize=5','/iam/users?page=2&pageSize=100','/iam/users?status=invited','/iam/users?status=active','/iam/invitations','/iam/users/search?q=a','/desk/agents','/desk/agents/count']){const r=await api('GET',p);out[p]={s:r.s,n:arr(r.j).length,total:r.j&&(r.j.total||r.j.totalCount||r.j.count||(r.j.meta&&r.j.meta.total)),t:r.s>=400?r.t.slice(0,120):undefined};}
// sorted? first/last created
const c=rows.map(r=>r.created_at||r.createdAt).filter(Boolean).sort();out.created={first:c[0],last:c[c.length-1]};
return out;
