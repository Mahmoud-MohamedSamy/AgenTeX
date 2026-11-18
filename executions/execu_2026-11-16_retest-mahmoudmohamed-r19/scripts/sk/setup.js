eval(fs.readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/sk/lib.js','utf8'));
const R={};
if(!I.D){const r=await api('POST','/desk/departments',{name:'QA RT19 SK Dept',description:'QA retest round 19 skills lane',agent_user_ids:[A1,A3]});R.dept=E(r);if(r.j?.data?.id){I.D=D=r.j.data.id;saveI();LED('department "QA RT19 SK Dept" '+D+' created, agents Test User 1 + Dev Team 2');}}
D=I.D;
for(const u of ['/desk/skill-types?department_id='+D,'/desk/skills/types?department_id='+D,'/desk/skill-types']){const r=await api('GET',u);R[u]=r.s+' '+r.t.slice(0,600);}
R.prefs=await prefs(D);
return R;
