eval(fs.readFileSync("D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/scripts/pc/hdr.js",'utf8'));
const R={};for(const [n,u] of [['TU1',A1],['DT2',A3]]){const c=await counts(u,AOB);R[n]={rec:c.rec,list:c.list,wl:c.wl};}
const bin=[];for(const n of [4945,4952]){}const r=await api('GET','/audit/recycle-bin/items?app_key=desk&limit=200');const L=arr(r.j?.data?.items||r.j?.data);R.bin=L.filter(x=>/QA RT20 PC/.test(JSON.stringify(x))).map(x=>(x.record_name||x.name||x.title||'')+' '+x.record_id);
const mt=JSON.parse(fs.readFileSync(OUT+'made.json','utf8'));R.made={tickets:mt.tickets.length,rules:mt.rules};R.rulesActive=(await listRules('round_robin',AOB)).concat(await listRules('round_robin',DA)).filter(x=>/QA RT20 PC/.test(x.name)).map(x=>x.name+':'+x.is_active);
return R;
