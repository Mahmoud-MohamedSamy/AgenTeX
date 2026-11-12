const L=await modId('leads'); await delAllQA();
for(const w of arr((await api('GET','/workflow/rules?module_id='+L)).j.data)) if(String(w.name).startsWith('QA SR1112')) await api('DELETE','/workflow/rules/'+w.id);
const r=await mkRule(L,{name:P+'G',entries:[ent('no_of_employees','gte',1,10),ent('no_of_employees','gte',2,10),ent('no_of_employees','gte',3,10),ent('no_of_employees','gte',4,10),ent('no_of_employees','gte',5,10),ent('no_of_employees','gte',6,10),ent('no_of_employees','gte',7,10)]}); I.ruleG=keepRule(r);
// score = 10 * min(no_of_employees,7)
const mkWf=async(name,trigger,field,val)=>{const b={moduleId:L,appKey:'crm',name:P+name,description:'QA',trigger:{kind:'RecordScoreChanged',...trigger},criteria:null,mode:'Recurring',actions:[{type:'FieldUpdate',order:0,delaySeconds:0,fieldUpdates:{[field]:{kind:'string',stringValue:val}}}],conditions:[],isActive:true};
 const x=await api('POST','/workflow/rules',b); const id=x.j&&x.j.data&&x.j.data.id; if(id){(I.wfs=I.wfs||[]).push(id);SAVE(); const g=(await api('GET','/workflow/rules/'+id)).j.data; if(g&&!g.isActive) await api('POST','/workflow/rules/'+id+'/activate');} else log('wf fail',name,SR(x).slice(0,400)); return id;};
const getF=async(id,f)=>{const d=(await api('GET','/modules/'+L+'/records/'+id)).j.data.data; const e=d.find(x=>x.field===f); return e&&e.value&&(e.value.value??null);};
const w1=await mkWf('G up',{scoreChange:'increased'},'title','UP');
const w2=await mkWf('G down',{scoreChange:'decreased'},'company','DOWN');
if(!w1||!w2){RES('G2','blocked','could not create workflow by API');return;}
const run=async(rec,emp)=>{await upd(L,rec,{title:'-',company:'-'}); await sleep(15000); await upd(L,rec,{title:'-',company:'-'}); await upd(L,rec,{no_of_employees:emp}); await sleep(20000); return [await recScore(L,rec), await getF(rec,'title'), await getF(rec,'company')];};
const a=await newRec(L,{no_of_employees:2}); await sleep(15000);
let s=await run(a,4); RES('G2',(s[0]===40&&s[1]==='UP'&&s[2]==='-')?'pass':'fail','score 20->'+s[0]+': increase wf title='+s[1]+', decrease wf company='+s[2]);
s=await run(a,1); RES('G3',(s[0]===10&&s[2]==='DOWN'&&s[1]==='-')?'pass':'fail','score 40->'+s[0]+': decrease wf company='+s[2]+', increase wf title='+s[1]);
await upd(L,a,{title:'-',company:'-'}); await sleep(15000); await upd(L,a,{title:'-',company:'-'}); await upd(L,a,{lead_source:'chat'}); await sleep(20000); const g5=[await recScore(L,a),await getF(a,'title'),await getF(a,'company')];
RES('G5',(g5[1]==='-'&&g5[2]==='-')?'pass':'fail','save without score change (score '+g5[0]+'): title='+g5[1]+' company='+g5[2]);
for(const id of [w1,w2]) await api('DELETE','/workflow/rules/'+id);
// G4 any
const w3=await mkWf('G any',{},'title','ANY'); let u=await run(a,3), d=await run(a,2); RES('G4',(u[1]==='ANY'&&d[1]==='ANY')?'pass':'fail','any change: up -> '+u[1]+', down -> '+d[1]); await api('DELETE','/workflow/rules/'+w3);
// G6 reaches 50
const w4=await mkWf('G reach50',{scoreChange:'increased',scoreThreshold:50},'title','R50');
const g6=[];for(const e of [4,5,6]){/*40,50,60*/ const x=await run(a,e); g6.push(x[0]+':'+x[1]);} // from 20: 40 no, 50 yes, 60 no
RES('G6',g6.join(',')==='40:-,50:R50,60:-'?'pass':'fail','from 20 then 40/50/60 -> '+g6.join(', ')+' (expect fire only on reaching 50)');
await api('DELETE','/workflow/rules/'+w4);
const w5=await mkWf('G below20',{scoreChange:'decreased',scoreThreshold:20},'title','B20'); const g7=[];for(const e of [3,2,1]){const x=await run(a,e);g7.push(x[0]+':'+x[1]);}
RES('G7',g7.join(',')==='30:-,20:-,10:B20'?'pass':'fail','from 60 then 30/20/10 -> '+g7.join(', ')+' (expect fire only on 20->10, "falls below 20")');
await api('DELETE','/workflow/rules/'+w5);
const w6=await mkWf('G cross50',{scoreThreshold:50},'title','X50'); const g8=[];for(const e of [6,3,4]){const x=await run(a,e);g8.push(x[0]+':'+x[1]);}
RES('G8',g8.join(',')==='60:X50,30:X50,40:-'?'pass':'fail','from 10 then 60/30/40 -> '+g8.join(', ')+' (expect fire 10->60 and 60->30, not 30->40)');
await api('DELETE','/workflow/rules/'+w6);
// G10 loop: wf on increase sets no_of_employees higher (which raises score again)
const lb={moduleId:L,appKey:'crm',name:P+'G loop',description:'QA',trigger:{kind:'RecordScoreChanged',scoreChange:'increased'},criteria:null,mode:'Recurring',actions:[{type:'FieldUpdate',order:0,delaySeconds:0,fieldUpdates:{no_of_employees:{kind:'int',intValue:7}}}],conditions:[],isActive:true};
let x=await api('POST','/workflow/rules',lb); const wl=x.j&&x.j.data&&x.j.data.id; if(wl){(I.wfs=I.wfs||[]).push(wl);SAVE();}
if(wl){await upd(L,a,{no_of_employees:2}); await sleep(30000); const s10=await recScore(L,a); const emp=await getF(a,'no_of_employees');
 RES('G10',(s10===70&&emp==7)?'pass':'info','increase wf writes employees=7 (score up again): final employees='+emp+', score='+s10+' — no loop, record saved; check the workflow log for a single run'); await api('DELETE','/workflow/rules/'+wl);}
else RES('G10','blocked','workflow with int field update refused '+SR(x).slice(0,200));
SAVE();
