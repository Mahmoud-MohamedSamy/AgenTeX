const L=await modId('leads'); await delAllQA();
for(const w of arr((await api('GET','/workflow/rules?module_id='+L)).j.data)) if(String(w.name).startsWith('QA SR1112')) await api('DELETE','/workflow/rules/'+w.id);
let r=await mkRule(L,{name:P+'G10a',entries:[ent('rating','eq','active',3)]}); keepRule(r);
r=await mkRule(L,{name:P+'G10b',entries:[ent('lead_source','eq','web',10)]}); keepRule(r);
const b={moduleId:L,appKey:'crm',name:P+'G loop',description:'QA',trigger:{kind:'RecordScoreChanged',scoreChange:'increased'},criteria:null,mode:'Recurring',actions:[{type:'FieldUpdate',order:0,delaySeconds:0,fieldUpdates:{lead_source:{kind:'string',stringValue:'web'}}}],conditions:[],isActive:true};
const x=await api('POST','/workflow/rules',b); const w=x.j&&x.j.data&&x.j.data.id; if(w){(I.wfs=I.wfs||[]).push(w);SAVE();}
// G11: workflow on edit with criteria score >= 13 sets title
const b2={moduleId:L,appKey:'crm',name:P+'G11 crit',description:'QA',trigger:{kind:'RecordCreatedOrUpdated'},criteria:{kind:'Comparison',field:'score',operator:'GreaterThanOrEqual',value:{kind:'int',intValue:13}},mode:'Recurring',actions:[{type:'FieldUpdate',order:0,delaySeconds:0,fieldUpdates:{title:{kind:'string',stringValue:'CRIT13'}}}],conditions:[],isActive:true};
const x2=await api('POST','/workflow/rules',b2); const w2=x2.j&&x2.j.data&&x2.j.data.id; if(w2){(I.wfs=I.wfs||[]).push(w2);SAVE();} log('G11 wf',SR(x2).slice(0,200));
const a=await newRec(L,{lead_source:'chat',title:'-'}); await sleep(15000);
await upd(L,a,{rating:'active'}); await sleep(30000);
const d=(await api('GET','/modules/'+L+'/records/'+a)).j.data.data; const gv=f=>{const e=d.find(y=>y.field===f);return e&&e.value&&e.value.value;};
RES('G10',(gv('lead_source')==='web'&&(await recScore(L,a))===13)?'pass':'fail','score 0->3 fires "increase" wf that sets Lead Source=web (score 3->13). Final lead_source='+gv('lead_source')+', score='+(await recScore(L,a))+'; record id '+a+' (timeline count checked in UI)');
RES('G11',w2?(gv('title')==='CRIT13'?'pass':'fail'):'blocked','workflow on create/edit with criteria Score >= 13 -> title='+gv('title')+(w2?'':' (wf refused '+SR(x2).slice(0,150)+')'));
I.g10rec=a; SAVE();
