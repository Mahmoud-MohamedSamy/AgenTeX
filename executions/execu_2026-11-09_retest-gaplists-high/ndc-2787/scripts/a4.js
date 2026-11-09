const out={};
const g=async p=>{const r=await api('GET',p);const d=arr(r.j);return {p,s:r.s,len:d.length,meta:r.j&&r.j.meta,first:d[0]&&(d[0].id||d[0].userId||d[0].user_id),last:d.length&&(d[d.length-1].id||d[d.length-1].userId),keys:d[0]&&Object.keys(d[0]).slice(0,25)}};
for(const p of ['/iam/users','/iam/users?page=2','/iam/users?page=2&page_size=50','/iam/users?pageNumber=2&pageSize=50','/iam/users?cursor=x','/iam/users?search=a','/iam/users/count','/iam/users?status=active']) out[p]=await g(p);
return out;
