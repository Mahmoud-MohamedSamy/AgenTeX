const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-10_retest-mahmoudmohamed-r15';
const LED=m=>fs.appendFileSync(RUN+'/ledger.md','- '+new Date().toISOString().slice(0,19)+' '+m+'\n');
const I=JSON.parse(fs.readFileSync(RUN+'/out/2806-ids.json','utf8')); const L='841043e1-c078-41f9-8d6e-dfd61bee45c3'; const E=r=>r.j&&r.j.error?r.j.error.code+': '+r.j.error.message:'';
const out={};
const vals=[]; for(let i=1;i<=120;i++) vals.push({label:'V'+String(i).padStart(3,'0')});
let r = await api('POST','/global-sets',{name:'QA RT15 GS Big', values:vals}); out.create={s:r.s,e:E(r)}; I.G5=r.j&&r.j.data&&r.j.data.id; if(I.G5) LED('global set QA RT15 GS Big '+I.G5);
fs.writeFileSync(RUN+'/out/2806-ids.json', JSON.stringify(I,null,1));
const names = vals.map(v=>v.label);
r = await api('POST','/global-sets/'+I.G5+'/values/remove',{values:names.slice(0,110)}); out.remove110={s:r.s,e:E(r)};
r = await api('POST','/global-sets/'+I.G5+'/values/restore',{values:names.slice(0,51)}); out.restore51={s:r.s,e:E(r)};
r = await api('POST','/global-sets/'+I.G5+'/values/restore',{values:names.slice(0,50)}); out.restore50={s:r.s,e:E(r)};
const d=(await api('GET','/global-sets/'+I.G5)).j.data; out.after={used:d.values.length, unused:d.unused_values.length};
// max values per set
const many=[]; for(let i=1;i<=1001;i++) many.push({label:'M'+i}); r = await api('POST','/global-sets',{name:'QA RT15 GS Huge', values:many}); out.huge={s:r.s,e:E(r)}; if(r.j&&r.j.data){ LED('global set QA RT15 GS Huge '+r.j.data.id); await api('DELETE','/global-sets/'+r.j.data.id); out.hugeDeleted=true; }
// duplicate name
r = await api('POST','/global-sets',{name:'QA RT15 GS Colors', values:[{label:'X'}]}); out.dupName={s:r.s,e:E(r)}; if(r.j&&r.j.data){ LED('dup '+r.j.data.id); await api('DELETE','/global-sets/'+r.j.data.id);}
// duplicate value labels
r = await api('POST','/global-sets',{name:'QA RT15 GS Dup', values:[{label:'X'},{label:'x'}]}); out.dupVals={s:r.s,e:E(r)}; if(r.j&&r.j.data){ await api('DELETE','/global-sets/'+r.j.data.id);}
return out;
