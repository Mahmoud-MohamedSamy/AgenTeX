// Desk Agent (no assignment permission): rules API vs round robin preferences API, QA AS6 Dept A.
const D='b3cd7c28-7879-42b1-b7a9-06bc9bf64aa6';const me=(await api('GET','/iam/me')).j?.data;
const perms=(await api('GET','/iam/me/permissions?app_key=desk')).j?.data||[];
const a=await api('GET','/desk/assignment-rules?type=round_robin&department_id='+D);const b=await api('GET','/desk/departments/'+D+'/round-robin-preferences');
const c=await api('PUT','/desk/departments/'+D+'/round-robin-preferences',{});
const ta=await api('GET','/desk/departments/'+D+'/team-assignment');
const o={when:new Date().toISOString(),profile:me?.profile_names||me?.profiles||null,hasAssignPerm:perms.filter(p=>/assign/.test(p)),
 rules:{req:'GET /api/v1/desk/assignment-rules?type=round_robin&department_id=…',status:a.s,body:a.t.slice(0,220)},
 prefs:{req:'GET /api/v1/desk/departments/{QA AS6 Dept A}/round-robin-preferences',status:b.s,body:b.t.slice(0,420)},
 prefsWrite:{req:'PUT same (empty body)',status:c.s,body:c.t.slice(0,160)},
 teamAssignment:{req:'GET /api/v1/desk/departments/{…}/team-assignment',status:ta.s,body:ta.t.slice(0,160)}};
fs.writeFileSync('../evidence/raw/agent-prefs-api.json',JSON.stringify(o,null,1));return o;
