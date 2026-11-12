const o={}; const ps=arr((await api('GET','/iam/profiles')).j.data); o.names=ps.map(x=>x.name+(x.app_key?'['+x.app_key+']':'')).filter(n=>/desk|agent|support/i.test(n)).slice(0,10);
const da=ps.find(x=>/desk administrator/i.test(x.name))||ps.find(x=>/desk/i.test(x.name)); o.keys=da&&Object.keys(da).join(',');
if(da){for(const p of ['/iam/profiles/'+da.id+'/permissions','/iam/profiles/'+da.id,'/iam/profiles/'+da.id+'/permissions?app=desk']){const r=await api('GET',p); o[p.replace(da.id,'{id}')]=r.s+' '+(r.t.match(/desk[:.][a-z_.:]+/g)||[]).slice(0,6).join(',');}}
const cat=await api('GET','/iam/permissions'); o.catalog=cat.s+' '+cat.t.slice(0,200);
return o;
