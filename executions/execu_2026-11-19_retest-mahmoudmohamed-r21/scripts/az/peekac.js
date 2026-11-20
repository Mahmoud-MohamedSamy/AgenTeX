var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/scripts/az/";eval(fs.readFileSync(__AS+'lib.js','utf8'));
const out={};const g=await api('GET','/modules/'+T+'/records?page=1&per_page=100&sort_by=created_at&sort_dir=desc');const L=g.j?.data?.items||g.j?.data||[];
for(const r of L){const o={};for(const x of r.data||[])o[x.field]=x.value?.value;if(/QA AC2/.test(o.subject||'')){const f=await feed(r.id);out[o.subject+' '+r.id]={dept:o.department,owner:nm(o.owner),created:r.created_at,feed:f.map(e=>[e.action,e.occurred_at,JSON.stringify(e.summary||{}).slice(0,300)])};}}
// find rule
const deps=(await api('GET','/desk/departments')).j?.data;const DL=Array.isArray(deps)?deps:(deps?.items||deps?.departments||[]);
for(const d of DL){const rs=await listRules('round_robin',d.id);for(const x of rs)if(/manual invoice/i.test(x.name)||/QA RT20 AZ/.test(x.name))out['rule '+x.name]={dept:d.name,dep:d.id,active:x.is_active,on:x.execute_on,targets:JSON.stringify(x.targets).slice(0,600),prefs:JSON.stringify(await prefs(d.id))};}
return out;
