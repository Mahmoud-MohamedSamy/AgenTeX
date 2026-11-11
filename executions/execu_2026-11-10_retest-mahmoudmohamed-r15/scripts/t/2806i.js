const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-10_retest-mahmoudmohamed-r15';
const I=JSON.parse(fs.readFileSync(RUN+'/out/2806-ids.json','utf8')); const L='841043e1-c078-41f9-8d6e-dfd61bee45c3'; const E=r=>r.j&&r.j.error?r.j.error.code+': '+r.j.error.message+' '+JSON.stringify(r.j.error.details||'').slice(0,300):'';
const out={};
let r = await api('POST','/global-sets/'+I.G+'/associate',{module_id:L, field_id:I.fA, mappings:[]}); out.noMap={s:r.s,e:E(r)};
if (r.s>=300) { r = await api('POST','/global-sets/'+I.G+'/associate',{module_id:L, field_id:I.fA, mappings:[{local_value:'Yellow', set_value:'Blue'}]}); out.map1={s:r.s,e:E(r),d:r.j&&JSON.stringify(r.j.data).slice(0,600)}; }
if (r.s>=300) { r = await api('POST','/global-sets/'+I.G+'/associate',{module_id:L, field_id:I.fA, mappings:{Yellow:'Blue'}}); out.map2={s:r.s,e:E(r),d:r.j&&JSON.stringify(r.j.data).slice(0,600)}; }
if (r.s>=300) { r = await api('POST','/global-sets/'+I.G+'/associate',{module_id:L, field_id:I.fA, mappings:[{from:'Yellow', to:'Blue'}]}); out.map3={s:r.s,e:E(r),d:r.j&&JSON.stringify(r.j.data).slice(0,600)}; }
const f = arr((await api('GET','/modules/'+L+'/fields')).j.data).find(x=>x.id===I.fA); out.fieldAfter={dto:f.datatypeOptions, cfg:f.config};
const ld = await api('GET','/modules/'+L+'/records/'+I.leads.Yellow); out.yellowLead = JSON.stringify(ld.j&&ld.j.data).match(/qa_rt15_gs_a[^}]*}/);
return out;
