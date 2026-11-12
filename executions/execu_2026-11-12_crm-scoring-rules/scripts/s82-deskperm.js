const o={}; const p=await api('GET','/iam/profiles?app=desk'); const ps=arr(p.j&&p.j.data); o.profiles=p.s+' n='+ps.length+' '+ps.slice(0,8).map(x=>x.name).join(', ');
const agent=ps.find(x=>/agent/i.test(x.name))||ps[0]; if(agent){const pm=await api('GET','/iam/profiles/'+agent.id+'/permissions'); const keys=[...new Set((pm.t.match(/"(permission_key|key)":"[^"]+"/g)||[]))]; o.agentProfile=agent.name; o.permStatus=pm.s; o.permCount=keys.length; o.sample=keys.slice(0,12).map(s=>s.split(':"')[1]);}
const cat=await api('GET','/iam/permissions?app=desk'); o.catalog=cat.s+' '+(cat.t.match(/"key":"desk[^"]*"/g)||[]).length+' desk keys';
return o;
