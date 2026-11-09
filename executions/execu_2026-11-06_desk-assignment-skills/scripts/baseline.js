const fs=require('fs'); const B={at:new Date().toISOString()};
const deps=(await api('GET','/desk/departments')).j.data; B.departments=deps;
B.direct=(await api('GET','/desk/assignment-rules?type=direct')).j;
B.notif=(await api('GET','/desk/assignment/notification-settings')).j;
B.criteriaFields=(await api('GET','/desk/assignment-rules/criteria-fields')).j;
B.skillTypes=(await api('GET','/desk/skill-types')).j;
B.presenceSettings=(await api('GET','/desk/agent-presence/settings')).j;
B.teams=(await api('GET','/desk/teams')).j;
B.perDept={};
for(const d of deps){ const q='department_id='+d.id; const x={};
 x.rr=(await api('GET','/desk/assignment-rules?type=round_robin&'+q)).j;
 x.rrPrefs=(await api('GET','/desk/departments/'+d.id+'/round-robin-preferences')).j;
 x.team=(await api('GET','/desk/departments/'+d.id+'/team-assignment')).j;
 x.skills=(await api('GET','/desk/skills?'+q)).j;
 x.skillPrefs=(await api('GET','/desk/skill-preferences?'+q)).j;
 x.agentSkills=(await api('GET','/desk/agent-skills?'+q)).j;
 B.perDept[d.name]=x; }
const users=(await api('GET','/iam/users?per_page=500')).j; B.usersCount=(arr(users.data)||[]).length;
const creds=JSON.parse(fs.readFileSync(process.env.CREDS,'utf8')); const U=arr(users.data);
B.credAccounts=creds.map((c,i)=>{const u=U.find(u=>(u.email||'').toLowerCase()===c.user.toLowerCase()); return {i,name:c.name,id:u&&u.id,status:u&&u.status,depts:u?deps.filter(d=>(d.agent_user_ids||[]).includes(u.id)).map(d=>d.name):null};});
fs.writeFileSync('../out/baseline.json',JSON.stringify(B,null,1));
const s={}; s.depts=deps.map(d=>[d.name,d.id.slice(0,8),d.is_default,(d.agent_user_ids||[]).length,d.routing_strategy]);
s.direct=(arr(B.direct.data).length||JSON.stringify(B.direct).slice(0,200)); s.notif=B.notif.data; s.skillTypes=JSON.stringify(B.skillTypes).slice(0,300); s.presence=JSON.stringify(B.presenceSettings).slice(0,400);
s.criteriaFieldCount=(B.criteriaFields.data&&B.criteriaFields.data.fields||[]).length;
for(const k in B.perDept){const x=B.perDept[k]; s[k]={rr:arr(x.rr.data).length||JSON.stringify(x.rr).slice(0,150), prefs:JSON.stringify(x.rrPrefs.data||x.rrPrefs).slice(0,500), team:JSON.stringify(x.team.data||x.team).slice(0,300), skills:arr(x.skills.data).length||JSON.stringify(x.skills).slice(0,200), skillPrefs:JSON.stringify(x.skillPrefs.data||x.skillPrefs).slice(0,200)};}
s.users=B.usersCount; s.cred=B.credAccounts; return s;
