const o={};
let r=await api('POST','/global-sets',{name:'QA GS1111 R3 BP',values:[{label:'Open'},{label:'Working'},{label:'Done'},{label:'Spare'}]}); I.BSET=r.j.data.id; LED('set R3 BP '+I.BSET);
r=await api('POST','/modules/'+L+'/fields',{fields:[{fieldName:'qa_gs1111_bp',labels:{en:'QA GS1111 BP'},datatypeKey:'pick_list',datatypeOptions:{allowed_values:['Open','Working','Done','Spare']},config:{allowed_values:['Open','Working','Done','Spare']}}]}); const d=r.j.data; I.fBP=Array.isArray(d)?d[0].id:(d.fields?d.fields[0].id:d.id); LED('field qa_gs1111_bp '+I.fBP);
o.assoc=SR(await api('POST','/global-sets/'+I.BSET+'/associate',{module_id:L,field_id:I.fBP,mappings:{}}));
const st=(id,i,t)=>({id,name:id,position:{x:80+260*i,y:80},isTerminal:t});
const tr=(id,f,t)=>({id,name:'QA '+f+' to '+t,fromStateId:f,toStateId:t,color:'#2563eb',before:{},during:{},after:{actions:[]}});
const def={name:'QA GS1111 BP',description:'',moduleKey:'leads',layoutId:I.LAY,targetField:'qa_gs1111_bp',continuous:false,entryCriteria:{op:'startsWith',field:'last_name',value:'BP '},states:[st('Open',0,false),st('Working',1,false),st('Done',2,true)],transitions:[tr('t0','Open','Working'),tr('t1','Working','Done')]};
r=await api('POST','/modules/'+L+'/blueprints',{isActive:false,definition:def}); o.create=SR(r)+' '+(r.s>=300?r.t.slice(0,300):''); I.BP=r.j&&r.j.data&&r.j.data.id; if(I.BP) LED('blueprint QA GS1111 BP (inactive) '+I.BP); SAVE();
const u=await api('GET','/global-sets/'+I.BSET+'/used-in'); o.usedIn=JSON.stringify(u.j.data.fields.map(f=>Object.keys(f).filter(k=>k!=='field'&&f[k].length).map(k=>k+':'+f[k])));
// inactive blueprint: try replace Working -> Spare and remove Done
o.replInactive=SR(await api('POST','/global-sets/'+I.BSET+'/values/replace',{replacements:{Working:'Spare'}}));
const b=await api('GET','/modules/'+L+'/blueprints/'+I.BP); o.bpStatesAfter=JSON.stringify((b.j.data.definition||b.j.data).states.map(s=>s.id))+' transitions '+JSON.stringify((b.j.data.definition||b.j.data).transitions.map(t=>t.fromStateId+'>'+t.toStateId));
fs.writeFileSync(RUN+'/out/bp-1.json',JSON.stringify({o,bp:b.j.data},null,1)); return o;
