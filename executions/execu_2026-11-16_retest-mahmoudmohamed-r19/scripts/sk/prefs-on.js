eval(fs.readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/sk/lib.js','utf8'));
const P0=JSON.parse(fs.readFileSync(OUT+'prefs-orig.json','utf8'));
if(process.env.MODE==='on'){const r=await setPrefs({...P0,assign_to_offline_agents:true});LED('QA RT19 SK Dept RR prefs assign_to_offline_agents=true for 2931 UI');return E(r);}
const r=await setPrefs(P0);const eq=JSON.stringify(await prefs())===JSON.stringify(P0);LED('QA RT19 SK Dept RR prefs restored, equal='+eq);return E(r)+' equal '+eq;
