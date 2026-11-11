const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-10_retest-mahmoudmohamed-r15';
const LED=m=>fs.appendFileSync(RUN+'/ledger.md','- '+new Date().toISOString().slice(0,19)+' '+m+'\n');
const L='841043e1-c078-41f9-8d6e-dfd61bee45c3'; const E=r=>r.j&&r.j.error?r.j.error.code+': '+r.j.error.message:'';
const out={};
const mk = async (name, vals) => { const r = await api('POST','/modules/'+L+'/fields',{fields:[{fieldName:name, labels:{en:name.replace(/_/g,' ').toUpperCase()}, datatypeKey:'pick_list', datatypeOptions:{allowed_values:vals}, config:{allowed_values:vals}}]}); const d=r.j&&r.j.data; const id = d && (Array.isArray(d)? d[0].id : (d.fields? d.fields[0].id : d.id)); if(id) LED('CRM Leads field '+name+' '+id); return {s:r.s,id,e:E(r),raw:id?undefined:r.t.slice(0,400)}; };
out.fA = await mk('qa_rt15_gs_a',['Red','Green','Yellow']);
out.fB = await mk('qa_rt15_gs_b',['North','South']);
// 1. create from scratch with colours
let r = await api('POST','/global-sets',{name:'QA RT15 GS Colors', description:'retest NDC-2806', colors_enabled:true, values:[{label:'Red',color:'#ff0000'},{label:'Green',color:'#00ff00'},{label:'Blue',color:'#0000ff'}]});
out.create = {s:r.s,e:E(r), d:r.j&&r.j.data}; const G = r.j&&r.j.data&&r.j.data.id; if(G) LED('global set QA RT15 GS Colors '+G);
fs.writeFileSync(RUN+'/out/2806-ids.json', JSON.stringify({G, fA:out.fA.id, fB:out.fB.id},null,1));
return out;
