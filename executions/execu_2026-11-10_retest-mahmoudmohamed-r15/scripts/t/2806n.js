const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-10_retest-mahmoudmohamed-r15';
const LED=m=>fs.appendFileSync(RUN+'/ledger.md','- '+new Date().toISOString().slice(0,19)+' '+m+'\n');
const I=JSON.parse(fs.readFileSync(RUN+'/out/2806-ids.json','utf8')); const L='841043e1-c078-41f9-8d6e-dfd61bee45c3'; const E=r=>r.j&&r.j.error?r.j.error.code+': '+r.j.error.message:'';
const out={}; I.extra=I.extra||[];
const fields=[]; for(let i=1;i<=15;i++) fields.push({fieldName:'qa_rt15_gs_x'+i, labels:{en:'QA RT15 GS X'+i}, datatypeKey:'pick_list', datatypeOptions:{allowed_values:['Red']}, config:{allowed_values:['Red']}});
let r = await api('POST','/modules/'+L+'/fields',{fields}); out.create={s:r.s,e:E(r)};
const all = arr((await api('GET','/modules/'+L+'/fields')).j.data).filter(f=>/^qa_rt15_gs_x\d+$/.test(f.fieldName));
for (const f of all) { if(!I.extra.includes(f.id)){ I.extra.push(f.id); LED('CRM Leads field '+f.fieldName+' '+f.id);} }
fs.writeFileSync(RUN+'/out/2806-ids.json', JSON.stringify(I,null,1));
const res=[]; for (const id of I.extra) { const a = await api('POST','/global-sets/'+I.G+'/associate',{module_id:L, field_id:id, mappings:{}}); res.push(a.s+(a.s>=300?' '+E(a):'')); }
out.assoc = res; out.count = (await api('GET','/global-sets/'+I.G)).j.data.field_count;
r = await api('DELETE','/global-sets/'+I.G); out.deleteAt16={s:r.s,e:E(r)};
r = await api('POST','/global-sets/'+I.G+'/values/replace',{replacements:{Green:'Red'}}); out.replaceAt16={s:r.s,e:E(r)};
r = await api('POST','/global-sets/'+I.G+'/values/remove',{values:['Green']}); out.removeAt16={s:r.s,e:E(r)};
return out;
