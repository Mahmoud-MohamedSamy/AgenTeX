for(const p of ['/iam/org-units','/iam/roles','/iam/org-units/tree']){const r=await api('GET',p);log(p,r.s,r.t.replace(/"(created|updated)[^,]*,/g,'').slice(0,700));}
