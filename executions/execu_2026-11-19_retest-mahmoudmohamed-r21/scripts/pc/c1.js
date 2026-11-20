eval(fs.readFileSync("D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/scripts/pc/hdr.js",'utf8'));
const R={at:new Date().toISOString()};
for(const [n,u] of [['TU1',A1],['DT2',A3]]){R[n+'-AOB']=await counts(u,AOB);const c=await counts(u,DA);R[n+'-AS6A']={rec:c.rec,wl:c.wl};}
R.prefsAOB=await prefs(AOB);R.prefsDA=await prefs(DA);
R.activeRulesAOB=(await listRules('round_robin',AOB)).filter(r=>r.is_active).map(r=>r.name);
R.activeRulesDA=(await listRules('round_robin',DA)).filter(r=>r.is_active).map(r=>r.name);
R.presence=await presence();
save('c1.json',R);return R;
