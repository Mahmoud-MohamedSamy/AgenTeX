const o={}; const pr=await api('GET','/iam/profiles'); o.ps=pr.s; o.profiles=arr(pr.j&&pr.j.data).map(p=>({id:p.id||p.profileId,name:p.name,app:p.app||p.appKey||p.app_key,parent:p.parentId||p.parent_id,n:(p.permissions||[]).length,keys:Object.keys(p).join(',')}));
const pm=await api('GET','/iam/permissions'); o.perm=pm.s; const P=arr(pm.j&&pm.j.data); o.pn=P.length; o.psample=P.slice(0,3); o.desk=P.filter(x=>/desk/.test(JSON.stringify(x))).length;
return o;
