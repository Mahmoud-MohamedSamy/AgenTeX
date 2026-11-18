let all=[];for(const q of ['','&offset=100','&page=2']){const r=await api('GET','/iam/users?limit=100'+q);all=all.concat(D(r.j)||[]);log(q,r.s,(D(r.j)||[]).length,JSON.stringify(r.j.meta).slice(0,200));}
const L=all; log(L.slice(0,2).map(u=>u.userId+' '+u.displayName));
L.forEach(u=>{const id=String(u.userId); if(/^(2a7c1bc4|5b3f7466|7e5e7c27|9d182dfa|876ce871|23f0f9d7)/.test(id)||/kinase|pobit|belopoy|fedel/.test(u.email||'')) log(id.slice(0,8)+' '+u.displayName+' '+JSON.stringify(u.profileNames)+' '+String(u.orgUnitId).slice(0,8)+' '+String(u.email).slice(0,5));});
