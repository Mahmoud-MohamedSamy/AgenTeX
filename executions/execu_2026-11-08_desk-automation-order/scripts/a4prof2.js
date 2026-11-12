const P=arr((await api('GET','/iam/profiles?limit=100')).j?.data);const o={keys:P[0]?Object.keys(P[0]).join(','):''};
for(const n of ['Desk Agent','Desk Administrator','Desk Light Agent']){const p=P.find(x=>x.name===n);if(!p)continue;const id=p.id||p.profile_id||p.profileId;const d=(await api('GET','/iam/profiles/'+id)).j?.data||{};
 const s=JSON.stringify(d);o[n]={id:String(id).slice(0,8),dkeys:Object.keys(d).join(','),wf:(s.match(/"[a-z_]*workflow[a-z_:.]*"[^,}]{0,40}/gi)||[]).slice(0,20)};}
const me=await api('GET','/iam/users/me');o.meS=me.s;
return o;
