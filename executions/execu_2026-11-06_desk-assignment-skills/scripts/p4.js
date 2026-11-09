eval(require('fs').readFileSync('lib.js','utf8'));
const creds=JSON.parse(require('fs').readFileSync(process.env.CREDS,'utf8'));const U=arr((await api('GET','/iam/users?per_page=500')).j.data);
const acc=creds.map((c,i)=>{const x=U.find(x=>(x.email||'').toLowerCase()===c.user.toLowerCase());return {i,name:c.name,id:x&&x.userId,profiles:x&&x.profileNames,owner:x&&x.isOwner};});
const deps=(await api('GET','/desk/departments')).j.data; for(const a of acc) a.depts=deps.filter(d=>(d.agent_user_ids||[]).includes(a.id)).map(d=>d.name).slice(0,4);
const d0=await api('GET','/desk/departments/'+deps[0].id); return {acc, deptKeys:Object.keys(d0.j.data||{}), agentDeptsQ: (await api('POST','/desk/agents/departments/query',{user_ids:acc.map(a=>a.id)})).t.slice(0,600)};
