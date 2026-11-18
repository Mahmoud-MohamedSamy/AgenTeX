var __B="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/bg/";eval(fs.readFileSync(__B+'blib.js','utf8'));
const o={};
const r=await api('GET','/desk/tickets?limit=3');o.list=r.s+' '+r.t.slice(0,1500);
for(const q of ['?owner_id='+A1+'&department_id='+AOB+'&limit=50','?assignee_id='+A1+'&limit=5','?view=my_open&limit=5']){const x=await api('GET','/desk/tickets'+q);o[q]=x.s+' n='+arr(x.j?.data).length+' '+JSON.stringify(x.j?.meta||{}).slice(0,200);}
return o;
