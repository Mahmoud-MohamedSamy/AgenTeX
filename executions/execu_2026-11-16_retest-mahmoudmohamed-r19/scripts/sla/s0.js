eval(fs.readFileSync('sla/lib.js','utf8'));
if(!D){const r=ok(await api('POST','/desk/departments',{name:'QA RT19 SLA Dept',description:'QA retest round 19 SLA lane',agent_user_ids:[SAMY,TU1]}),'dept');D=r.j.data.id;led(`department "QA RT19 SLA Dept" ${D} created, agents Mahmoud Samy + Test User 1`);setCfg({D});}
if(!DB){const r=ok(await api('POST','/desk/departments',{name:'QA RT19 SLA Dept B',description:'QA retest round 19 SLA lane, no Mahmoud Samy',agent_user_ids:[TU1]}),'deptB');DB=r.j.data.id;led(`department "QA RT19 SLA Dept B" ${DB} created, agent Test User 1`);setCfg({DB});}
const g=(await api('GET','/desk/departments/'+D)).j?.data;log(JSON.stringify({D,DB,a:g?.agent_user_ids,keys:Object.keys(g||{})}));
const one=(await api('GET','/modules/'+T+'/records?limit=1')).j;log(JSON.stringify(one).slice(0,2500));
