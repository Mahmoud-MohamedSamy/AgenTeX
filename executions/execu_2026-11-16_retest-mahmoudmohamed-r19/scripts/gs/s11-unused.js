const o={}; const vals=Array.from({length:560},(_,i)=>({label:'V'+String(i+1).padStart(3,'0')}));
let r=await api('POST','/global-sets',{name:'QA RT19 GS Unused',description:'QA RT19 GS - safe to delete',values:vals}); o.create=SR(r); I.U=r.j&&r.j.data&&r.j.data.id; if(I.U) LED('set QA RT19 GS Unused '+I.U+' (560 values)'); SAVE();
let moved=0, stop=null;
for (let b=0; b<12; b++) { const chunk=vals.slice(b*50,b*50+50).map(v=>v.label); const x=await api('POST','/global-sets/'+I.U+'/values/remove',{values:chunk}); if(x.s<300) moved+=chunk.length; else { stop=SR(x)+' when unused='+moved+' and batch of '+chunk.length; break; } }
o.moved=moved; o.stop=stop;
if(moved===500){ const x=await api('POST','/global-sets/'+I.U+'/values/remove',{values:['V501']}); o.single501=SR(x); }
if(moved>500) o.note='more than 500 unused allowed';
const g=await gs(I.U); o.final='used '+g.values.length+' unused '+g.unused_values.length;
o.over50=SR(await api('POST','/global-sets/'+I.U+'/values/restore',{values:vals.slice(0,51).map(v=>v.label)}));
return o;
