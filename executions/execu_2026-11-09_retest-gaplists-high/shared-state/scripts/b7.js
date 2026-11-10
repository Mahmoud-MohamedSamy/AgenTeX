const out={};
const p=arr((await api('GET','/iam/profiles?app_key=crm')).j.data);out.crmProfiles=p.map(x=>[x.name,x.rank,(x.id||x.profileId||'').slice(0,36)].join('|'));
const ou=arr((await api('GET','/iam/org-units')).j.data);const byId={};ou.forEach(o=>byId[o.orgUnitId||o.id]=o);
const show=id=>{const o=Object.values(byId).find(x=>(x.orgUnitId||x.id).startsWith(id));return o?{id:o.orgUnitId||o.id,n:o.name,parent:o.parentId,path:o.path,kids:ou.filter(k=>k.parentId===(o.orgUnitId||o.id)).map(k=>k.name+'|'+(k.orgUnitId||k.id).slice(0,8))}:null};
out.samyOU=show('60aeb9ce');out.m1515OU=show('5533f730');out.ownerOU=show('a9de6b1e');
const samy=show('60aeb9ce');if(samy&&samy.parent){out.samyParent=show(samy.parent.slice(0,8));}
const u=(await api('GET','/iam/users/d23fb4e0-248d-41f6-af60-d28885a7007e'));out.samyDetail=u.s+' '+JSON.stringify(u.j&&u.j.data).slice(0,700);
return out;
