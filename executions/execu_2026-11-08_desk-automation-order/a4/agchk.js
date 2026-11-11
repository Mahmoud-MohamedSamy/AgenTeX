const A=JSON.parse(fs.readFileSync('../a4/agent.json','utf8'));const L=arr2((await api('GET','/iam/users?limit=200')).j?.data);
const u=L.find(x=>x.id===A.uid||x.user_id===A.uid);return {n:L.length,found:!!u,status:u&&u.status,name:u&&(u.display_name||u.name)};
