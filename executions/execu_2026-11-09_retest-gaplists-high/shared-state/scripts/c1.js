const out={};
const q=async p=>{const r=await api('GET',p);const a=arr(r.j&&r.j.data!==undefined?r.j.data:r.j);return {s:r.s,n:a.length,meta:r.j&&(r.j.meta||r.j.pagination||null),first:a[0]&&(a[0].email||a[0].name||a[0].user_id),last:a.length&&(a[a.length-1].email||a[a.length-1].name),keys:a[0]?Object.keys(a[0]).slice(0,25):null,status:a.reduce((m,u)=>{const k=u.status||u.state||'?';m[k]=(m[k]||0)+1;return m},{})};};
for(const p of ['/iam/users','/iam/users?page=2&pageSize=50','/iam/users?offset=200','/iam/users?search=mmohamed','/iam/users?status=active','/iam/invitations','/iam/users/invitations','/iam/invites','/iam/users/count'])out[p]=await q(p);
return out;
