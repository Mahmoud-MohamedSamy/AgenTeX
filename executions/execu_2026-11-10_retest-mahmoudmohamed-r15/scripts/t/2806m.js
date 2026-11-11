const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-10_retest-mahmoudmohamed-r15';
const LED=m=>fs.appendFileSync(RUN+'/ledger.md','- '+new Date().toISOString().slice(0,19)+' '+m+'\n');
const I=JSON.parse(fs.readFileSync(RUN+'/out/2806-ids.json','utf8')); const L='841043e1-c078-41f9-8d6e-dfd61bee45c3'; const E=r=>r.j&&r.j.error?r.j.error.code+': '+r.j.error.message+' '+JSON.stringify(r.j.error.details||'').slice(0,200):'';
const out={};
let r = await api('POST','/modules/'+L+'/views',{ name:'QA RT15 2806 Purple view', kind:'list', visibility:'private', settings:{ columns:['first_name','qa_rt15_gs_a'], criteria:{ conditions:[{field:'qa_rt15_gs_a', operator:'equals', value:'Purple'}] } } });
const vid = r.j&&r.j.data&&(r.j.data.id||(r.j.data.view&&r.j.data.view.id)); out.view={s:r.s,e:E(r),vid}; if(vid){I.view=vid; LED('CRM Leads view QA RT15 2806 Purple view '+vid);}
r = await api('GET','/global-sets/'+I.G+'/used-in'); out.usedIn = JSON.stringify(r.j.data.fields[0].custom_views);
r = await api('POST','/global-sets/'+I.G+'/values/replace',{replacements:{Purple:'Red'}}); out.replace={s:r.s,e:E(r)};
await sleep(3000);
r = await api('GET','/modules/'+L+'/views/'+vid); out.viewCriteriaAfter = JSON.stringify(r.j&&r.j.data&&(r.j.data.settings||r.j.data.view&&r.j.data.view.settings)).slice(0,500);
const ld = await api('GET','/modules/'+L+'/records/'+I.leads.Yellow); out.yellowLead = (JSON.stringify(ld.j.data).match(/qa_rt15_gs_a\",\"value\":\{[^}]*}/)||[])[0];
fs.writeFileSync(RUN+'/out/2806-ids.json', JSON.stringify(I,null,1));
return out;
