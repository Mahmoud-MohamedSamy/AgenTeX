const R={};const l=await api('GET','/help-centers');const L=l.j?.data?.items||l.j?.data||[];R.list=l.s;
R.hcs=(Array.isArray(L)?L:[L]).map(x=>({id:x.id,name:x.name,status:x.status||x.is_published,url:x.url||x.public_url||x.domain||x.portal_url,keys:Object.keys(x).join(',').slice(0,400)}));
const id=(Array.isArray(L)?L[0]:L)?.id;if(id){for(const p of ['','/served-departments','/invite-target']){const r=await api('GET','/help-centers/'+id+p);R[p||'detail']=r.s+' '+r.t.replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+/g,'<e>').slice(0,900);}}
return R;
