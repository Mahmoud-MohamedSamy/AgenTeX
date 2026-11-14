const o={}; let r;
await mkSet('QA RT17 GS 2919',['Open','Working','Done','Spare'],'S19');
r=await api('POST','/modules/'+L+'/fields',{fields:[{fieldName:'qa_rt17_bp',labels:{en:'QA RT17 BP'},datatypeKey:'pick_list',datatypeOptions:{global_set_id:I.S19},config:{}}]}); I.fBP=fid(r); SAVE(); LED('field Leads qa_rt17_bp '+I.fBP);
const st=(id,i,t)=>({id,name:id,position:{x:80+260*i,y:80},isTerminal:t}); const tr=(id,f,t)=>({id,name:'QA '+f+' to '+t,fromStateId:f,toStateId:t,color:'#2563eb',before:{},during:{},after:{actions:[]}});
const def={name:'QA RT17 2919 BP',description:'',moduleKey:'leads',layoutId:I.LAY,targetField:'qa_rt17_bp',continuous:false,entryCriteria:{op:'startsWith',field:'last_name',value:'RT17BP '},states:[st('Open',0,false),st('Working',1,false),st('Done',2,true)],transitions:[tr('t0','Open','Working'),tr('t1','Working','Done')]};
r=await api('POST','/modules/'+L+'/blueprints',{isActive:false,definition:def}); o.create=SR(r)+' '+(r.s>=300?r.t.slice(0,300):''); I.BP=r.j&&r.j.data&&r.j.data.id; if(I.BP) LED('blueprint QA RT17 2919 BP (inactive) '+I.BP); SAVE();
const u=await api('GET','/global-sets/'+I.S19+'/used-in'); o.usedInBP=JSON.stringify(u.j.data.fields[0].blueprints);
r=await api('POST','/global-sets/'+I.S19+'/values/remove',{values:['Done']}); o.removeDone=SR(r)+' '+(r.s>=300?r.t.slice(0,300):'');
const g=await gs(I.S19); o.set=g.values.map(v=>v.value)+' | unused '+g.unused_values.map(v=>v.value);
const B='/modules/'+L+'/blueprints/'+I.BP; const b=(await api('GET',B)).j.data; o.states=JSON.stringify((b.definition||b).states.map(s=>s.id));
// replace on inactive (should still work and update states)
r=await api('POST','/global-sets/'+I.S19+'/values/replace',{replacements:{Working:'Spare'}}); o.replInactive=SR(r)+' '+(r.s>=300?r.t.slice(0,200):'');
const b2=(await api('GET',B)).j.data; o.statesAfterReplace=JSON.stringify((b2.definition||b2).states.map(s=>s.id))+' tr '+JSON.stringify((b2.definition||b2).transitions.map(t=>t.fromStateId+'>'+t.toStateId));
// can it be switched on? (QA-only entry criteria) then off
const on=await api('PUT',B,{isActive:true,definition:b2.definition||b2}); o.on=SR(on)+' '+(on.s>=300?on.t.slice(0,250):''); if(on.s<300){LED('blueprint '+I.BP+' ON'); const bb=(await api('GET',B)).j.data; const off=await api('PUT',B,{isActive:false,definition:bb.definition||bb}); o.off=SR(off); LED('blueprint '+I.BP+' OFF '+o.off);}
fs.writeFileSync(RUN+'/out/2919.json',JSON.stringify(o,null,1)); return o;
