const o={};
const sets=arr((await api('GET','/global-sets?limit=200')).j.data); const SRC=sets.find(s=>s.name==='Source').id, IND=sets.find(s=>s.name==='Industry').id;
const f=await mkSetF(L,'qa_rt19_gs_src',SRC,'QA RT19 GS Source'); I.fSrc=f.id; SAVE(); o.srcField=f.s+' '+f.e;
if(f.id){ const x=await mkRec(L,'Src LC1',{qa_rt19_gs_src:'Cold Call'}); I.R.SRC1=x[1]; o.srcRec=x[0]+' '+(await recVal(L,x[1],'qa_rt19_gs_src')); const y=await mkRec(L,'Src bad',{qa_rt19_gs_src:'chat'}); o.srcBad=y[0]; if(y[1]) I.R.SRCBAD=y[1]; }
const leadSrc=arr((await api('GET','/modules/'+L+'/fields')).j.data).find(x=>x.fieldName==='lead_source');
const p=await api('GET','/global-sets/'+SRC+'/association-preview?module_id='+L+'&field_id='+leadSrc.id); o.previewLeadSource=p.s+' '+p.t.slice(0,600);
const lay=I.LAY; const st=(id,i,t)=>({id,name:id,position:{x:80+260*i,y:80},isTerminal:t});
const tr=(id,f2,t)=>({id,name:'QA RT19 GS '+f2+' to '+t,fromStateId:f2,toStateId:t,color:'#2563eb',before:{},during:{},after:{actions:[]}});
const def={name:'QA RT19 GS BP',description:'QA RT19 GS - inactive',moduleKey:'leads',layoutId:lay,targetField:'qa_rt19_gs_tier',continuous:false,entryCriteria:{op:'startsWith',field:'last_name',value:'QA RT19 GS BP '},states:[st('Silver',0,false),st('Platinum',1,false),st('Bronze',2,true)],transitions:[tr('t0','Silver','Platinum'),tr('t1','Platinum','Bronze')]};
const r=await api('POST','/modules/'+L+'/blueprints',{isActive:false,definition:def}); o.bp=SR(r)+' '+(r.s>=300?r.t.slice(0,300):''); I.BP=r.j&&r.j.data&&r.j.data.id; if(I.BP) LED('blueprint QA RT19 GS BP (inactive) '+I.BP+' on qa_rt19_gs_tier'); SAVE();
const u=(await api('GET','/global-sets/'+I.T+'/used-in')).j.data; o.usedIn=JSON.stringify(u.fields.map(f=>f.field.module_label+': '+Object.keys(f).filter(k=>k!=='field'&&f[k].length).map(k=>k+'='+f[k]).join('; '))) +' not_tracked '+JSON.stringify(u.not_tracked);
const vu=(await api('GET','/global-sets/'+I.T+'/values/usage?value=Platinum')).j.data; o.usagePlatinum=JSON.stringify(vu.fields.map(f=>f.field.module_label+' rec='+f.record_count+' bp='+f.blueprints+' maps='+f.dependency_maps));
o.removePlatinum=SR(await api('POST','/global-sets/'+I.T+'/values/remove',{values:['Platinum']}));
return o;
