// NDC-2839: Desk Agent (no desk:assignment:manage) vs RR preferences / team assignment GET+PUT, rules GET; control = department list still readable.
const DA='b3cd7c28-7879-42b1-b7a9-06bc9bf64aa6',SK13='f4bb810f';
const OUT='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/as/out/';
const me=(await api('GET','/iam/me')).j?.data;
const perms=(await api('GET','/iam/me/permissions?app_key=desk')).j?.data||[];
const deps=(await api('GET','/desk/departments')).j?.data;const DL=Array.isArray(deps)?deps:(deps?.items||[]);
const d13=DL.find(x=>x.name==='QA SK13 Dept A');
const sh=r=>({status:r.s,body:r.t.slice(0,260)});
const o={when:new Date().toISOString(),who:'Customer Experience Specialists 2 (agent)',profile:me?.profile_names||me?.profiles||me?.profile||null,
 hasAssignPerm:(Array.isArray(perms)?perms:[]).filter(p=>/assign/.test(typeof p==='string'?p:JSON.stringify(p))),
 rulesGet:sh(await api('GET','/desk/assignment-rules?type=round_robin&department_id='+DA)),
 prefsGet:sh(await api('GET','/desk/departments/'+DA+'/round-robin-preferences')),
 prefsPut:sh(await api('PUT','/desk/departments/'+DA+'/round-robin-preferences',{})),
 teamAssignGet:sh(await api('GET','/desk/departments/'+DA+'/team-assignment')),
 teamAssignPut:sh(await api('PUT','/desk/departments/'+DA+'/team-assignment',{enabled:true})),
 prefsGetSK13:d13?sh(await api('GET','/desk/departments/'+d13.id+'/round-robin-preferences')):'no SK13 dept',
 teamAssignGetSK13:d13?sh(await api('GET','/desk/departments/'+d13.id+'/team-assignment')):'',
 notifSettingsGet:sh(await api('GET','/desk/assignment/notification-settings')),
 deptListControl:{status:DL.length?200:'?',count:DL.length,teamFlagInList:DL[0]?Object.keys(DL[0]).filter(k=>/team|assign/i.test(k)):[]}};
fs.writeFileSync(OUT+'t2839-agent.json',JSON.stringify(o,null,1));return o;
