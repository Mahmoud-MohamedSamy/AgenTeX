// E2E-2 check + restore skill, prefs.
eval(fs.readFileSync('lib-as.js','utf8'));const j=JSON.parse(fs.readFileSync('../e2e2.json','utf8'));const rs=JSON.parse(fs.readFileSync('../e2e2-restore.json','utf8'));const R={};
R.a2AfterClose=(await wl(A2)).all;R.thr=(await prefs()).department_threshold;R.backlogAfterA2Closes=await waitOwn(j.back,40);R.trigger=(await feed(j.back)).find(e=>e.action==='ticket.auto_assigned')?.summary?.trigger;
R.off=await setA(j.rule,false);R.skill=(await api('PUT','/desk/skills/'+rs.skill,rs.save)).s+'/'+(await api('PUT','/desk/skills/'+rs.skill+'/agents',{user_ids:rs.ag0})).s;
const P=await prefs();R.prefs=E(await setPrefs({...P,department_threshold_enabled:false,assign_on_closure:false,assign_backlogs:false,department_threshold:40}));return R;
