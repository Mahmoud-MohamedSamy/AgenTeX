// F-08 check (owner) and restore.
eval(fs.readFileSync('lib-as.js','utf8'));const j=JSON.parse(fs.readFileSync('../f8.json','utf8'));const R={};
R.a1Now=(await wl(A1)).all;R.threshold=(await prefs()).department_threshold;R.presence=await presence();R.backlogAfterClose=await waitOwn(j.back,30);const f=(await feed(j.back)).find(e=>e.action==='ticket.auto_assigned');R.trigger=f?.summary?.trigger;
R.off=await setA(j.rule,false);R.restore=E(await setPrefs(JSON.parse(fs.readFileSync('../f8-p0.json','utf8'))));return R;
