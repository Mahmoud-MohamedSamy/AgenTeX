const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-10_retest-mahmoudmohamed-r15';
const out={};
const p = await api('GET','/settings/timeline/visibility'); out.policy = p.s+' '+p.t.slice(0,600);
if (p.s===200) fs.writeFileSync(RUN+'/out/1948-policy-backup.json', JSON.stringify(p.j.data));
const ul = await api('GET','/iam/users?per_page=500'); const u = arr(ul.j&&ul.j.data).filter(x=>x.displayName==='Mahmoud Samy'); out.user = u.map(x=>({id:x.userId, profiles:x.profileNames, status:x.status}));
return out;
