// F-08 setup (owner): pool A1 rule, threshold = A1 open + 1, assign on closure ON, backlogs off. Saves ids to ../f8.json.
eval(fs.readFileSync('lib-as.js','utf8'));const R={};const P0=await prefs();fs.writeFileSync('../f8-p0.json',JSON.stringify(P0));
const k='AOF8b'+U;const r=await rule('round_robin','F8b',[rrT(k,'sequential',[A1])]);const a1=(await wl(A1)).all;
R.prefs=E(await setPrefs({...P0,department_threshold_enabled:true,department_threshold:Math.min(200,a1+1),assign_backlogs:false,assign_on_closure:true}));
const first=await tk(k+' first');R.first=await waitOwn(first);R.a1AfterFirst=(await wl(A1)).all;const back=await tk(k+' backlog');await sleep(20000);R.backlog=await own(back);R.a1=a1;
fs.writeFileSync('../f8.json',JSON.stringify({first,back,rule:r.j.data.id}));return R;
