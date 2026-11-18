var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/as/";eval(fs.readFileSync(__AS+'lib.js','utf8'));
const AOB='4853562a-0b4d-45cb-ba34-9f2118fcd32c';const out={};let total=0,active=[];
for(const [t,d] of [['round_robin',DA],['round_robin',DB],['round_robin',AOB],['direct',null]]){const L=(await listRules(t,d)).filter(r=>/QA RT19 AS/.test(r.name));total+=L.length;for(const r of L)if(r.is_active)active.push(r.name);}
const base=JSON.parse(fs.readFileSync(OUT+'baseline.json','utf8'));
out.rules={total,active};out.prefsA_same=JSON.stringify(await prefs(DA))===JSON.stringify(base.prefsA);out.prefsB_same=JSON.stringify(await prefs(DB))===JSON.stringify(base.prefsB);
out.prefsAOB_same=JSON.stringify(await prefs(AOB))===JSON.stringify(JSON.parse(fs.readFileSync(OUT+'nf3-prefs-orig.json','utf8')));
const n=await notif();out.notif_same=JSON.stringify(n)===JSON.stringify(base.notif);out.direct=n?.direct_assignment_enabled??JSON.stringify(n).slice(0,200);
const sl=await api('GET','/desk/sla-policies?department_id='+DA);out.sla=(arr(sl.j?.data)).filter(p=>/QA RT19 AS/.test(p.name)).map(p=>p.name+' active='+(p.is_active??p.active));
return out;
