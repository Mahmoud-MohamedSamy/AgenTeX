const L=await modId('leads');
const mkF=async(mod,name,type,vals)=>{const r=await api('POST','/modules/'+mod+'/fields',{fields:[{fieldName:name,labels:{en:name.toUpperCase().replace(/_/g,' ')},datatypeKey:type,datatypeOptions:vals?{allowed_values:vals}:{},config:vals?{allowed_values:vals}:{}}]}); const d=r.j&&r.j.data; const id=d&&(Array.isArray(d)?d[0].id:(d.fields?d.fields[0].id:d.id)); if(id){(I.fields=I.fields||[]).push([mod,id]);SAVE();} else log('mkF fail',name,SR(r).slice(0,200)); return id;};
// K1: delete a field used by a rule
const fk='qa_sr1112_num'; const fid=await mkF(L,fk,'number');
let r=await mkRule(L,{name:P+'K1',entries:[ent(fk,'gte',5,9)]}); const k1=keepRule(r); log('K1 rule',SR(r).slice(0,120));
const rec=await newRec(L,{[fk]:6}); const s0=await recScore(L,rec);
const del=await api('DELETE','/modules/'+L+'/fields/'+fid); const usage=await api('GET','/modules/'+L+'/rule-usage?field_id='+fid);
const g=k1&&(await api('GET','/scoring-rules/'+k1)); const after=await upd(L,rec,{title:'k1'}); const s1=await recScore(L,rec);
const newOne=await newRec(L,{lead_source:'chat'});
RES('K1',del.s>=400?'pass':(after.s<300&&newOne?'info':'fail'),'score with field 6 = '+s0+'; delete field used by a rule -> '+SR(del).slice(0,200)+'; rule after: '+(g?g.s+' entries='+JSON.stringify(g.j&&g.j.data&&g.j.data.entries).slice(0,120):'')+'; save record after -> '+after.s+' score '+s1+'; new record save '+(newOne?'ok':'FAILED'));
// K2: pick list value removed
const pk='qa_sr1112_pl'; const pid=await mkF(L,pk,'pick_list',['Alpha','Beta']);
r=await mkRule(L,{name:P+'K2',entries:[ent(pk,'eq','Alpha',4)]}); const k2=keepRule(r);
const pr=await newRec(L,{[pk]:'Alpha'}); const p0=await recScore(L,pr);
const f=(await fields(L)).find(x=>x.id===pid); const upf=await api('PUT','/modules/'+L+'/fields/'+pid,{...f,datatypeOptions:{allowed_values:['Beta','Gamma']},config:{...(f.config||{}),allowed_values:['Beta','Gamma']}});
let upf2=upf; if(upf.s>=400) upf2=await api('PATCH','/modules/'+L+'/fields/'+pid,{datatypeOptions:{allowed_values:['Beta','Gamma']},config:{allowed_values:['Beta','Gamma']},rowVersion:f.rowVersion});
const g2=k2&&(await api('GET','/scoring-rules/'+k2)); const pu=await upd(L,pr,{title:'k2'}); const p1=await recScore(L,pr);
RES('K2',upf2.s>=400?'pass':'info','score with Alpha = '+p0+'; remove Alpha from the list -> '+SR(upf2).slice(0,200)+'; rule after: '+(g2&&JSON.stringify(g2.j&&g2.j.data&&g2.j.data.entries).slice(0,120))+'; save record -> '+pu.s+' score '+p1);
// K5 custom module without Score
const S=await modId('services'); const before=(await fields(S)).find(x=>x.fieldName==='score');
r=await mkRule(S,{name:P+'K5',entries:[ent('name','isNotNull',undefined,3)]}); const k5=keepRule(r); const fl=(await fields(S)).find(x=>x.fieldName==='score');
let sr=null, sv=null; if(k5){const rq=await api('POST','/modules/'+S+'/records',recBody({name:P+'svc'})); sr=rq.j&&rq.j.data&&rq.j.data.id; if(sr){(I.recs=I.recs||[]).push([S,sr]);SAVE(); sv=await recScore(S,sr);} else log('svc rec',SR(rq).slice(0,200));}
RES('K5',(k5&&fl&&sv===3)?'pass':'fail','Services had score field before: '+!!before+'; create rule '+SR(r).slice(0,150)+'; score field after: '+(fl?fl.datatypeKey+' sys='+fl.isSystemManaged:'none')+'; record score '+sv);
// K6 module with own "score" field
const A=await modId('agency'); const hasScore=(await fields(A)).find(x=>x.fieldName==='score'); let own=null; if(!hasScore) own=await mkF(A,'score','number');
r=await mkRule(A,{name:P+'K6',entries:[ent('name','isNotNull',undefined,1)]}); keepRule(r);
RES('K6',r.s>=400?'pass':'fail','own field "score" created: '+(own?'yes':'no ('+(hasScore?'already there':'refused')+')')+'; create rule -> '+SR(r).slice(0,220));
// K4 conversion with a Contacts rule
const C=await modId('contacts'); r=await mkRule(C,{name:P+'K4',entries:[ent('email','contains','qa.test',5)]}); const k4=keepRule(r);
const cv=await newRec(L,{last_name:P+'conv2',lead_source:'web',company:P+'ConvCo2',email:'conv2@qa.test'}); const cr=await api('POST','/modules/'+L+'/records/'+cv+'/convert',{});
const ct=(cr.j&&cr.j.data&&cr.j.data.targets||[]).find(t=>t.moduleKey==='contacts'); await sleep(3000); const cs=ct?await recScore(C,ct.recordId):null;
(cr.j&&cr.j.data&&cr.j.data.targets||[]).forEach(t=>{(I.recs=I.recs||[]).push([t.moduleId,t.recordId]);}); SAVE();
RES('K4',cs===5?'pass':'fail','convert '+cr.s+'; contact created with email conv2@qa.test, Contacts rule "email contains qa.test +5": contact score '+cs+'. Lead score before convert '+(await recScore(L,cv)));
