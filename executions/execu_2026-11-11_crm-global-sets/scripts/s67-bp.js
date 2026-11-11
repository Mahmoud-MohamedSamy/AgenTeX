const o={}; const B='/modules/'+L+'/blueprints/'+I.BP; let b=(await api('GET',B)).j.data; const def=b.definition||b;
const on=await api('PUT',B,{isActive:true,definition:def}); o.on=SR(on); o.active=(await api('GET',B)).j.data.isActive; LED('blueprint '+I.BP+' switched ON (QA criteria last_name starts with "BP ") '+o.on);
try{
 const g=await gs(I.BSET); o.setNow=g.values.map(v=>v.value)+' | unused '+g.unused_values.map(v=>v.value);
 const x=await api('POST','/modules/'+L+'/records',rec({first_name:'QA GS1111',last_name:'BP 2',qa_gs1111_bp:'New'})); const lid=x.j&&x.j.data&&(x.j.data.id||x.j.data.record.id); I.BPL2=lid; SAVE(); LED('record BP 2 '+lid);
 await sleep(4000); const s1=await api('GET','/modules/'+L+'/records/'+lid+'/blueprint-state'); o.state1=JSON.stringify(s1.j&&s1.j.data).slice(0,400);
 const t1=await api('GET','/modules/'+L+'/records/'+lid+'/blueprint-transitions'); o.trans1=JSON.stringify(t1.j&&t1.j.data).slice(0,300);
 o.replaceActive=SR(await api('POST','/global-sets/'+I.BSET+'/values/replace',{replacements:{New:'Open'}})); await sleep(3000);
 o.leadVal=await recVal(L,lid,'qa_gs1111_bp'); const s2=await api('GET','/modules/'+L+'/records/'+lid+'/blueprint-state'); o.state2=JSON.stringify(s2.j&&s2.j.data).slice(0,400);
 const t2=await api('GET','/modules/'+L+'/records/'+lid+'/blueprint-transitions'); o.trans2=JSON.stringify(t2.j&&t2.j.data).slice(0,300);
 const bb=(await api('GET',B)).j.data; o.bpAfter=JSON.stringify((bb.definition||bb).states.map(s=>s.id))+' '+JSON.stringify((bb.definition||bb).transitions.map(t=>t.fromStateId+'>'+t.toStateId));
 o.removeSpare=SR(await api('POST','/global-sets/'+I.BSET+'/values/remove',{values:['Spare']})); const b3=(await api('GET',B)).j.data; o.bpAfterRemove=JSON.stringify((b3.definition||b3).transitions.map(t=>t.fromStateId+'>'+t.toStateId));
} finally { b=(await api('GET',B)).j.data; const off=await api('PUT',B,{isActive:false,definition:b.definition||b}); o.off=SR(off)+' active='+(await api('GET',B)).j.data.isActive; LED('blueprint '+I.BP+' switched OFF '+o.off); }
fs.writeFileSync(RUN+'/out/bp-3.json',JSON.stringify(o,null,1)); return o;
