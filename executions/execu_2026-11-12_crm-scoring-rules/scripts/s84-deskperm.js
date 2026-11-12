const o={}; const ps=arr((await api('GET','/iam/profiles')).j.data); const da=ps.find(x=>x.name==='Desk Agent'); o.profile=da&&{name:da.name,app:da.appKey,inherits:da.inheritsPermissions};
const r=await api('GET','/iam/profiles/'+da.profileId+'/permissions'); const keys=[...new Set((r.t.match(/"permission_?[kK]ey":"[^"]+"/g)||[]).map(s=>s.split(':"')[1].replace('"','')))]; o.perm=r.s+' count='+keys.length; o.deskKeys=keys.filter(k=>/^desk/.test(k)).length; o.sample=keys.filter(k=>/^desk/.test(k)).slice(0,10);
const cat=arr((await api('GET','/iam/permissions')).j.data); o.catalogDesk=cat.filter(x=>x.app==='desk').length;
return o;
