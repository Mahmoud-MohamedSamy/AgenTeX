const P=arr((await api('GET','/iam/profiles?limit=100')).j?.data);const p=P.find(x=>x.name==='Desk Agent');const id=p.profileId;const o={id};
for(const u of ['/iam/profiles/'+id,'/iam/profiles/'+id+'/permissions','/iam/permissions?profileId='+id,'/iam/profiles/'+id+'/grants']){const r=await api('GET',u);const s=JSON.stringify(r.j?.data||'');o[u.replace(id,'{id}')]=[r.s,s.length,(s.match(/workflow[a-z_:.]*/gi)||[]).slice(0,12)];}
return o;
