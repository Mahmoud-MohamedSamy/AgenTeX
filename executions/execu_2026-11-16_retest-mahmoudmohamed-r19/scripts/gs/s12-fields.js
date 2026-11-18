const o={};
o.delUnusedSet=SR(await api('DELETE','/global-sets/'+I.U)); LED('deleted set QA RT19 GS Unused '+I.U+' → '+o.delUnusedSet.slice(0,3));
const mods=arr((await api('GET','/modules')).j.data); const km=m=>m.apiName||m.api_name||m.key||m.name; const M={leads:L,contacts:I.C,accounts:mods.find(m=>km(m)==='accounts').id,deals:mods.find(m=>km(m)==='deals').id};
let r=await api('POST','/global-sets',{name:'QA RT19 GS Fields',description:'QA RT19 GS - safe to delete',values:[{label:'A'},{label:'B'}]}); I.FS=r.j.data.id; LED('set QA RT19 GS Fields '+I.FS); I.FF=I.FF||[]; SAVE();
let total=0; o.per={};
for (const [k,cnt] of [['leads',16],['contacts',16],['accounts',3],['deals',2]]) { let made=0, stop=null; for (let i=1;i<=cnt;i++){ if(k==='accounts'||k==='deals'){ if(total>=30 && k==='deals'){} } const f=await mkSetF(M[k],'qa_rt19_gs_f'+k.slice(0,2)+String(i).padStart(2,'0'),I.FS,'QA RT19 GS F '+k+' '+i); if(f.id){I.FF.push([M[k],f.id]); made++; total++; SAVE();} else { stop=f.s+' '+f.e+' (after '+made+' on '+k+', set total '+total+')'; break; } if(k==='accounts' && total>=30) break; }
 o.per[k]={made,stop}; }
const g=await gs(I.FS); o.setFieldCount=g.fields.length+' / field_count '+g.field_count;
return o;
