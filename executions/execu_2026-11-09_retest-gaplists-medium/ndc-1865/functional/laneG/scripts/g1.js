eval(require('fs').readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-1865/functional/laneG/scripts/lib.js','utf8'));
const o={};IDS.me='97be04b6-0a08-4883-aa51-e1650b11cab7';IDS.A='876ce871-2b02-4854-89a7-68050391c62b';IDS.B='e82f62cb-9904-42c7-a13c-77a7449820b9';saveIds();
if(!IDS.D){const r=await api('POST','/desk/departments',{name:'QA FT 1865 Dept',agent_user_ids:[IDS.me,IDS.A,IDS.B],visibility:'public'});o.dept=sh(r);const id=r.j&&r.j.data&&(r.j.data.id||r.j.data.department&&r.j.data.department.id);if(id){IDS.D=id;LED('CREATED department "QA FT 1865 Dept" '+id+' (agents owner, Test User 1, QA Team 1)');saveIds();}}
const pr=await api('GET','/desk/departments/'+IDS.D+'/round-robin-preferences');o.rrPrefs=pr.j&&pr.j.data;
const F=arr((await api('GET','/modules/'+T+'/fields')).j.data);o.dtypes=[...new Set(F.map(f=>f.datatypeKey))];
o.IDS=IDS;return o;
