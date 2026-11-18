var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/as/";eval(fs.readFileSync(__AS+'lib.js','utf8'));
const r=await api('GET','/audit/recycle-bin/items?app_key=desk&limit=200');const L=arr(r.j?.data);
const sp=JSON.parse(fs.readFileSync(OUT+'allt.json','utf8')).filter(x=>x.sp);
return {s:r.s,meta:r.j?.meta,n:L.length,k:Object.keys(L[0]||{}),sample:JSON.stringify(L[0]).slice(0,800),tickets:L.filter(x=>/ticket/i.test(JSON.stringify(x).slice(0,300))).slice(0,30).map(x=>JSON.stringify(x).slice(0,250)),spam:sp};
