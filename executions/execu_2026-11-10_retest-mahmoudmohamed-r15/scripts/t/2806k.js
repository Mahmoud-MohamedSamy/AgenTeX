const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-10_retest-mahmoudmohamed-r15';
const LED=m=>fs.appendFileSync(RUN+'/ledger.md','- '+new Date().toISOString().slice(0,19)+' '+m+'\n');
const I=JSON.parse(fs.readFileSync(RUN+'/out/2806-ids.json','utf8')); const L='841043e1-c078-41f9-8d6e-dfd61bee45c3'; const E=r=>r.j&&r.j.error?r.j.error.code+': '+r.j.error.message+' '+JSON.stringify(r.j.error.details||'').slice(0,200):'';
const gs = async id => { const d=(await api('GET','/global-sets/'+id)).j.data; return {v:d.values.map(x=>x.value), u:d.unused_values.map(x=>x.value)}; };
const out={};
let r = await api('POST','/global-sets/'+I.G+'/values/remove',{values:['Purple']}); out.remove={s:r.s,e:E(r), gs: await gs(I.G)};
r = await api('POST','/global-sets/'+I.G+'/values/restore',{values:['Purple','Green']}); out.restore={s:r.s,e:E(r), gs: await gs(I.G)};
r = await api('POST','/global-sets/'+I.G+'/clone'); out.clone={s:r.s,e:E(r), name:r.j&&r.j.data&&r.j.data.name, fields:r.j&&r.j.data&&r.j.data.field_count, vals:r.j&&r.j.data&&r.j.data.values.map(v=>v.value)}; if(r.j&&r.j.data){I.G3=r.j.data.id; LED('global set clone '+r.j.data.name+' '+I.G3);}
r = await api('POST','/global-sets/'+I.G+'/clone'); out.clone2={s:r.s,e:E(r), name:r.j&&r.j.data&&r.j.data.name}; if(r.j&&r.j.data){I.G4=r.j.data.id; LED('global set clone2 '+r.j.data.name+' '+I.G4);}
r = await api('GET','/global-sets/'+I.G+'/used-in'); out.usedIn={s:r.s,e:E(r), d:JSON.stringify(r.j&&r.j.data).slice(0,900)};
// locked system fields on Leads
const fl = arr((await api('GET','/modules/'+L+'/fields')).j.data);
const st = fl.filter(f => /status|stage/i.test(f.fieldName) && (f.isSystemField||f.datatypeKey==='status')).map(f=>({id:f.id,n:f.fieldName,t:f.datatypeKey,sys:f.isSystemField}));
out.lockedCandidates = st.slice(0,6);
for (const f of st.slice(0,2)) { const a = await api('GET','/global-sets/'+I.G+'/association-preview?module_id='+L+'&field_id='+f.id); const b = await api('POST','/global-sets/'+I.G+'/associate',{module_id:L, field_id:f.id, mappings:{}}); out['lock_'+f.n]={preview:a.s+' '+E(a), assoc:b.s+' '+E(b)}; }
// non-picklist field
const tx = fl.find(f=>f.datatypeKey==='single_line'&&f.isCustomField); const c = await api('POST','/global-sets/'+I.G+'/associate',{module_id:L, field_id:tx.id, mappings:{}}); out.textField = c.s+' '+E(c);
// field B already associated with G2: associate with G too
const d2 = await api('POST','/global-sets/'+I.G+'/associate',{module_id:L, field_id:I.fB, mappings:{}}); out.alreadyLinked = d2.s+' '+E(d2);
fs.writeFileSync(RUN+'/out/2806-ids.json', JSON.stringify(I,null,1));
return out;
