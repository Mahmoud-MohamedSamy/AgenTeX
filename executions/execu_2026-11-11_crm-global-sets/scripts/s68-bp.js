const o={}; const B='/modules/'+L+'/blueprints/'+I.BP; let b=(await api('GET',B)).j.data;
let on=await api('PUT',B,{isActive:true,definition:b.definition||b}); o.invalidDetail=on.t.slice(0,600);
o.restore=SR(await api('POST','/global-sets/'+I.BSET+'/values/restore',{values:['Working','Open','Done']}));
let g=await gs(I.BSET); await api('PUT','/global-sets/'+I.BSET,{name:g.name,description:g.description,colors_enabled:false,values:g.values.concat([{label:'Start'}]),row_version:g.row_version}); o.set=(await gs(I.BSET)).values.map(v=>v.value).join(',');
const st=(id,i,t)=>({id,name:id,position:{x:80+260*i,y:80},isTerminal:t}); const tr=(id,f,t)=>({id,name:'QA '+f+' to '+t,fromStateId:f,toStateId:t,color:'#2563eb',before:{},during:{},after:{actions:[]}});
const def=Object.assign({},b.definition||b,{states:[st('Open',0,false),st('Working',1,false),st('Done',2,true)],transitions:[tr('t0','Open','Working'),tr('t1','Working','Done')]});
on=await api('PUT',B,{isActive:true,definition:def}); o.on=SR(on); o.active=(await api('GET',B)).j.data.isActive; LED('blueprint '+I.BP+' switched ON '+o.on);
try{
 const x=await api('POST','/modules/'+L+'/records',rec({first_name:'QA GS1111',last_name:'BP 3',qa_gs1111_bp:'Open'})); const lid=x.j&&x.j.data&&(x.j.data.id||x.j.data.record.id); I.BPL3=lid; SAVE(); LED('record BP 3 '+lid);
 await sleep(4000); const s1=await api('GET','/modules/'+L+'/records/'+lid+'/blueprint-state'); o.state1=JSON.stringify(s1.j&&s1.j.data).slice(0,300); const t1=await api('GET','/modules/'+L+'/records/'+lid+'/blueprint-transitions'); o.trans1=JSON.stringify(arr(t1.j&&t1.j.data).map(t=>t.transitionId||t.id||t.name));
 o.replaceActive=SR(await api('POST','/global-sets/'+I.BSET+'/values/replace',{replacements:{Open:'Start'}})); await sleep(3000);
 o.leadVal=await recVal(L,lid,'qa_gs1111_bp'); const s2=await api('GET','/modules/'+L+'/records/'+lid+'/blueprint-state'); o.state2=JSON.stringify(s2.j&&s2.j.data).slice(0,300); const t2=await api('GET','/modules/'+L+'/records/'+lid+'/blueprint-transitions'); o.trans2=JSON.stringify(arr(t2.j&&t2.j.data).map(t=>t.transitionId||t.id||t.name));
 const bb=(await api('GET',B)).j.data; o.bpAfter=JSON.stringify((bb.definition||bb).states.map(s=>s.id))+' active='+bb.isActive;
 o.removeDone=SR(await api('POST','/global-sets/'+I.BSET+'/values/remove',{values:['Done']})); const b3=(await api('GET',B)).j.data; o.afterRemove='states '+JSON.stringify((b3.definition||b3).states.map(s=>s.id))+' active='+b3.isActive;
} finally { const bb=(await api('GET',B)).j.data; const off=await api('PUT',B,{isActive:false,definition:bb.definition||bb}); o.off=SR(off)+' active='+(await api('GET',B)).j.data.isActive; LED('blueprint '+I.BP+' switched OFF '+o.off); }
fs.writeFileSync(RUN+'/out/bp-4.json',JSON.stringify(o,null,1)); return o;
