eval(require('fs').readFileSync('lib.js','utf8'));
const o={};
const g=await getRule(IDS.RR_TEAM);o.rrTeam=JSON.stringify(g).slice(0,1500);
o.pref=(await api('GET','/desk/departments/'+IDS.DA+'/round-robin-preferences')).t.slice(0,800);
o.rrAll=(await rules('round_robin',IDS.DA)).map(r=>r.name+'|'+r.is_active+'|'+JSON.stringify(r.execute_on)+'|'+r.id.slice(0,8));
o.teams=(await api('GET','/desk/teams?department_id='+IDS.DA)).t.slice(0,600);
const L=await api('GET','/modules/'+T+'/records?limit=3&sort=created_at&order=asc');o.listS=L.s;o.list=L.t.slice(0,600);
return o;
