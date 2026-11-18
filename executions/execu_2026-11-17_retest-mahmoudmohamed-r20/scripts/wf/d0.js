eval(fs.readFileSync('wf/lib.js','utf8'));
const o={};const CEO='7972984b-b5cc-034a-bd96-6de61e3937d0';
const us=arr((await api('GET','/iam/users?take=300')).j?.data);const nmU=id=>{const x=us.find(u=>u.userId===id);return x?x.displayName:id};
o.ceo=us.filter(u=>u.orgUnitId===CEO).map(u=>[u.displayName,u.userId,u.status,u.profileNames]);
const deps=arr((await api('GET','/desk/departments?take=200')).j?.data);
o.deps=deps.filter(d=>/Customer Support|QA AO Dept A|QA RT19 WF|QA RT20 WF/.test(d.name)).map(d=>[d.name,d.id,(d.agent_user_ids||[]).map(nmU)]);
const pr=await api('GET','/iam/profiles?take=100');o.profiles=arr(pr.j?.data).map(p=>[p.name,p.id]).slice(0,30);o.prs=pr.s;
return o;
