const D='0c0e4194-8a21-44d8-a7cb-2daa011499b7', S1='07eb6b9e-229c-4970-846c-45d56d47d16a';
const A1='876ce871-2b02-4854-89a7-68050391c62b', A2='d23fb4e0-248d-41f6-af60-d28885a7007e', A3='5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4';
const o={};
o.a=await api('PUT',`/desk/skills/${S1}/agents`,{user_ids:[A1]}); o.a=[o.a.s,o.a.t.slice(0,200)];
o.agentPut=await api('PUT',`/desk/agents/${A2}/skills?department_id=${D}`,{skills:['QA SK12 S2','QA SK12 S3']}); o.agentPut=[o.agentPut.s,o.agentPut.t.slice(0,250)];
const after=(await api('GET',`/desk/skills?department_id=${D}`)).j.data.skills; o.map=after.filter(s=>/S[123]$/.test(s.name)).map(s=>[s.name,s.agent_ids]);
const as=await api('GET',`/desk/agent-skills?department_id=${D}`); o.agentSkillsKeys=Object.keys(as.j.data); o.agentsRows=JSON.stringify(as.j.data).slice(-600);
o.outsider=await api('PUT',`/desk/skills/${S1}/agents`,{user_ids:[A1,A3]}); o.outsider=[o.outsider.s,o.outsider.t.slice(0,300)];
return o;
