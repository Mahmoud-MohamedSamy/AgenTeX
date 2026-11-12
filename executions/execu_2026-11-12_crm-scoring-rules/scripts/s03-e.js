const L=await modId('leads');
// inspect C9 strnum stored
const all=arr((await api('GET','/scoring-rules?module_id='+L)).j.data); const sn=all.find(x=>x.name===P+'pts strnum'); log('strnum stored', JSON.stringify(sn&&sn.entries));
// dup-entry effect
log('deleted',await delAllQA());
let r=await mkRule(L,{name:P+'dup',entries:[ent('lead_source','eq','chat',3),ent('lead_source','eq','chat',3)]}); const dup=keepRule(r);
const a=await newRec(L,{lead_source:'chat'}); const sa=await recScore(L,a); RES('C19',sa===6?'info':'info','identical entries accepted (201); a chat lead scores '+sa+' (counted twice). Zoho refuses identical criteria (ALREADY_USED).');
await api('DELETE','/scoring-rules/'+dup);
// E setup
r=await mkRule(L,{name:P+'R1',entries:[ent('lead_source','eq','web',10),ent('industry','eq','technology',5)]}); I.R1=keepRule(r);
r=await mkRule(L,{name:P+'R2',entries:[ent('rating','eq','active',20),ent('lead_status','eq','No Answer',-15)]}); I.R2=keepRule(r); SAVE();
// E1
const e1=await newRec(L,{lead_source:'web'}); const s1=await recScore(L,e1); RES('E1',s1===10?'pass':'fail','new web lead score='+s1+' (expect 10)');
// E2
await upd(L,e1,{lead_source:'chat'}); const s2=await recScore(L,e1); RES('E2',s2===0?'pass':'fail','web->chat score='+s2+' (expect 0)');
// E3
const e3=await newRec(L,{lead_source:'web',industry:'technology',rating:'active',lead_status:'No Answer'}); const s3=await recScore(L,e3); RES('E3',s3===20?'pass':'fail','all four match score='+s3+' (expect 10+5+20-15=20)');
// E4
const e4=await newRec(L,{lead_status:'No Answer'}); const s4=await recScore(L,e4); RES('E4',s4===-15?'pass':'fail','only -15 matches score='+s4);
// E5 existing record before rule
const old=await newRec(L,{industry:'finance'}); const so=await recScore(L,old);
r=await mkRule(L,{name:P+'R3',entries:[ent('industry','eq','finance',7)]}); I.R3=keepRule(r); await sleep(3000);
const so2=await recScore(L,old); await upd(L,old,{title:'touch'}); const so3=await recScore(L,old);
RES('E5',(so2===so&&so3===7)?'pass':'info','before rule '+so+', after rule created (not saved) '+so2+', after save '+so3+' — TAVI scores only on next save (see Z6)');
// E6 inactive
const other=await newRec(L,{industry:'finance'}); const pre=await recScore(L,other);
let x=await api('PATCH','/scoring-rules/'+I.R3+'/active',{is_active:false}); await upd(L,old,{title:'touch2'}); const so4=await recScore(L,old); const pre2=await recScore(L,other);
RES('E6',(x.s<300&&so4===0&&pre2===pre)?'pass':'fail','deactivate '+SR(x)+'; saved record '+so3+'->'+so4+'; unsaved record stays '+pre+'->'+pre2);
// E7 delete
await api('PATCH','/scoring-rules/'+I.R3+'/active',{is_active:true}); await upd(L,old,{title:'t3'}); await upd(L,other,{title:'t3'});
const b1=await recScore(L,old), b2=await recScore(L,other);
x=await api('DELETE','/scoring-rules/'+I.R3); await upd(L,old,{title:'t4'}); const d1=await recScore(L,old), d2=await recScore(L,other);
RES('E7',(x.s<300&&d1===0&&d2===b2)?'pass':'fail','delete '+SR(x)+'; saved '+b1+'->'+d1+'; unsaved '+b2+'->'+d2+' (Zoho removes at once, see Z14)');
I.unsavedStale=other; SAVE();
// E8 edit points
const g=(await api('GET','/scoring-rules/'+I.R1)).j.data; const ents=g.entries.map(e=>({id:e.id,field_key:e.field_key,operator:e.operator,value:e.value,points:e.field_key==='lead_source'?25:e.points}));
x=await api('PUT','/scoring-rules/'+I.R1,{name:g.name,description:g.description,is_active:true,entries:ents,row_version:g.row_version});
await upd(L,e1,{lead_source:'web'}); const s8=await recScore(L,e1); RES('E8',(x.s<300&&s8===25)?'pass':'fail','edit +10->+25 '+SR(x)+'; score='+s8);
// E12 manual score
const m1=await upd(L,e1,{score:999}); const s12=await recScore(L,e1);
const m2=await api('POST','/modules/'+L+'/records',recBody({first_name:P+'rec',score:999})); const mid2=m2.j&&m2.j.data&&m2.j.data.id; if(mid2){(I.recs=I.recs||[]).push([L,mid2]);SAVE();}
const s12b=mid2?await recScore(L,mid2):null;
RES('E12',(s12===25&&(s12b===0||s12b===null||m2.s>=400))?'pass':'fail','PATCH score=999 -> '+SR(m1)+' score now '+s12+'; create with score=999 -> '+SR(m2)+' score '+s12b);
// E13
const C=await modId('contacts'); const cr=await newRec(C,{last_name:P+'c',lead_source:'web'}); const sc=cr?await recScore(C,cr):'n/a'; RES('E13',(sc===0||sc===null)?'pass':'fail','contact with web source, lead rules only: score='+sc);
// E14 big totals
const big=Array.from({length:25},()=>null).map((_,i)=>ent('no_of_employees','gte',0,10000));
r=await mkRule(L,{name:P+'big1',entries:big}); I.big1=keepRule(r); r=await mkRule(L,{name:P+'big2',entries:big}); I.big2=keepRule(r);
const bg=await newRec(L,{no_of_employees:5}); const sb=await recScore(L,bg); RES('E14',sb===500000?'pass':'fail','50 entries x 10000 matched: score='+sb+' (expect 500000)');
await api('DELETE','/scoring-rules/'+I.big1); await api('DELETE','/scoring-rules/'+I.big2);
SAVE();
