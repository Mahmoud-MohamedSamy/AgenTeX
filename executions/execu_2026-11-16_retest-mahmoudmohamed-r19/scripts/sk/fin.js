eval(fs.readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/sk/lib.js','utf8'));
const R={};const P0=JSON.parse(fs.readFileSync(OUT+'prefs-orig.json','utf8'));
R.rules=(await listRules('round_robin',D)).map(r=>r.name+' active='+r.is_active);
for(const id of [I.WF,I.WF0]){const g=(await api('GET','/workflow/rules/'+id)).j?.data;R['wf '+g?.name]='active='+g?.isActive;}
R.prefsEqual=JSON.stringify(await prefs())===JSON.stringify(P0);
const g=(await api('GET','/desk/departments/'+D)).j?.data;const p=await api('PUT','/desk/departments/'+D+'/agents',{agent_user_ids:[]});R.removeAgents=E(p);
const n=(await api('GET','/desk/departments/'+D)).j?.data;R.agentsNow=n?.agent_user_ids;if(p.s<300)LED('department "QA RT19 SK Dept" '+D+': agents removed (was Test User 1 + Dev Team 2; they were not members before the lane created it)');
return R;
