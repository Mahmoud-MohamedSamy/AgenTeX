var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/as/";
eval(fs.readFileSync(__AS+'lib.js','utf8'));
const I=JSON.parse(fs.readFileSync(OUT+'ids.json','utf8'));const R={};
const r=await api('POST','/modules/'+T+'/records',{data:fields({subject:PFX+' SKPROBE names',description:'x',department:DA,status:'Open',priority:'high',owner:O,skills:['QA RT19 AS S1']})});
const id=r.j?.data?.id;made.tickets.push(id);saveMade();LED('ticket created '+id+' "QA RT19 AS SKPROBE names" owner O');R.create=r.s+' '+r.t.slice(0,300);
await sleep(3000);const raw=await recRaw(id);R.skillsField=JSON.stringify((raw?.data||[]).find(x=>x.field==='skills'));
R.tskills=(await api('GET','/desk/tickets/'+id+'/skills')).t.slice(0,500);
const meta=(await api('GET','/modules/'+T+'/fields')).j?.data;const L=Array.isArray(meta)?meta:(meta?.fields||[]);R.fieldMeta=JSON.stringify(L.find(f=>(f.key||f.api_name||f.name)==='skills')||L.map(f=>f.key||f.api_name||f.name).slice(0,60)).slice(0,800);
return R;
