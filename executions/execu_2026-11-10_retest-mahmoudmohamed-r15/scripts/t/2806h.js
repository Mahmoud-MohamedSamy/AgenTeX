const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-10_retest-mahmoudmohamed-r15';
const LED=m=>fs.appendFileSync(RUN+'/ledger.md','- '+new Date().toISOString().slice(0,19)+' '+m+'\n');
const I=JSON.parse(fs.readFileSync(RUN+'/out/2806-ids.json','utf8')); const L='841043e1-c078-41f9-8d6e-dfd61bee45c3'; const E=r=>r.j&&r.j.error?r.j.error.code+': '+r.j.error.message+' '+JSON.stringify(r.j.error.details||'').slice(0,300):'';
const enc=v=>({kind:'string',value:String(v)}); const body=vals=>({data:Object.entries(vals).map(([f,v])=>({field:f,value:enc(v)}))});
const out={}; I.leads=I.leads||{};
for (const c of ['Red','Green','Yellow']) { const r = await api('POST','/modules/'+L+'/records', body({first_name:'QA RT15', last_name:'2806 '+c, qa_rt15_gs_a:c})); const d=r.j&&r.j.data; const id=d&&(d.id||(d.record&&d.record.id)); out['lead'+c]={s:r.s,id,e:E(r)}; if(id){I.leads[c]=id; LED('CRM lead QA RT15 2806 '+c+' '+id);} }
fs.writeFileSync(RUN+'/out/2806-ids.json', JSON.stringify(I,null,1));
let r = await api('GET','/global-sets/'+I.G+'/association-preview?module_id='+L+'&field_id='+I.fA); out.preview={s:r.s,e:E(r),d:r.j&&r.j.data};
return out;
