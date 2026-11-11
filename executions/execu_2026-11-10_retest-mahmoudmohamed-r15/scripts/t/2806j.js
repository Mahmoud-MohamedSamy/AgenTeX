const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-10_retest-mahmoudmohamed-r15';
const LED=m=>fs.appendFileSync(RUN+'/ledger.md','- '+new Date().toISOString().slice(0,19)+' '+m+'\n');
const I=JSON.parse(fs.readFileSync(RUN+'/out/2806-ids.json','utf8')); const L='841043e1-c078-41f9-8d6e-dfd61bee45c3'; const E=r=>r.j&&r.j.error?r.j.error.code+': '+r.j.error.message+' '+JSON.stringify(r.j.error.details||'').slice(0,300):'';
const fld = async id => { const f = arr((await api('GET','/modules/'+L+'/fields')).j.data).find(x=>x.id===id); return {av:f.datatypeOptions.allowed_values, col:f.datatypeOptions.option_colors, gs:f.datatypeOptions.global_set_name}; };
const leadVal = async id => { const d=(await api('GET','/modules/'+L+'/records/'+id)).j; const m = JSON.stringify(d&&d.data).match(/qa_rt15_gs_a\",\"value\":\{\"kind\":\"[a-z]+\",\"value\":\"?([^"}]*)/); return m&&m[1]; };
const out={};
// convert field B
let r = await api('POST','/global-sets/from-field',{module_id:L, field_id:I.fB, name:'QA RT15 GS Regions', description:null}); out.convert={s:r.s,e:E(r),vals:r.j&&r.j.data&&r.j.data.values, fields:r.j&&r.j.data&&r.j.data.field_count}; if(r.j&&r.j.data){I.G2=r.j.data.id; LED('global set QA RT15 GS Regions (from field B) '+I.G2);}
out.fB = await fld(I.fB);
// update: rename Green label, add Purple
let g = (await api('GET','/global-sets/'+I.G)).j.data;
const vals = g.values.map(v => v.value==='Green' ? {...v, label:'Green Leaf', color:'#008800'} : v).concat([{label:'Purple', color:'#800080'}]);
r = await api('PUT','/global-sets/'+I.G,{name:g.name, description:g.description, colors_enabled:true, values:vals, row_version:g.row_version}); out.update={s:r.s,e:E(r),vals:r.j&&r.j.data&&r.j.data.values};
out.fA_afterUpdate = await fld(I.fA);
// stale row_version
r = await api('PUT','/global-sets/'+I.G,{name:g.name, description:g.description, colors_enabled:true, values:vals, row_version:g.row_version}); out.staleUpdate={s:r.s,e:E(r)};
// replace Green -> Red
r = await api('POST','/global-sets/'+I.G+'/values/replace',{replacements:{Green:'Red'}}); out.replace={s:r.s,e:E(r)};
if (r.s>=300) { r = await api('POST','/global-sets/'+I.G+'/values/replace',{replacements:[{from:'Green',to:'Red'}]}); out.replace2={s:r.s,e:E(r)}; }
await sleep(3000);
out.greenLeadNow = await leadVal(I.leads.Green);
out.afterReplace = (await api('GET','/global-sets/'+I.G)).j.data; out.afterReplace = {values: out.afterReplace.values.map(v=>v.value+'/'+v.label), unused: out.afterReplace.unused_values};
out.fA_afterReplace = await fld(I.fA);
fs.writeFileSync(RUN+'/out/2806-ids.json', JSON.stringify(I,null,1));
return out;
