const L=await modId('leads'); await delAllQA();
const r=await mkRule(L,{name:P+'H3',entries:[ent('lead_source','eq','web',1)]}); const h=keepRule(r);
const g=(await api('GET','/scoring-rules/'+h)).j.data; const b=pts=>({name:g.name,is_active:true,entries:g.entries.map(e=>({id:e.id,field_key:e.field_key,operator:e.operator,value:e.value,points:pts}))});
const t1=await api('PUT','/scoring-rules/'+h,{...b(5),row_version:g.row_version}); const v1=(await api('GET','/scoring-rules/'+h)).j.data;
const t2=await api('PUT','/scoring-rules/'+h,{...b(9),row_version:g.row_version}); const v2=(await api('GET','/scoring-rules/'+h)).j.data;
RES('H3',t2.s===409?'pass':'fail','tab1 PUT points 5 with row_version '+g.row_version+' -> '+t1.s+' (now v'+v1.row_version+'); tab2 PUT points 9 with old row_version '+g.row_version+' -> '+SR(t2).slice(0,160)+'; stored points='+v2.entries[0].points+' v'+v2.row_version);
const t3=await api('PUT','/scoring-rules/'+h,{...b(3)}); const v3=(await api('GET','/scoring-rules/'+h)).j.data;
RES('H2',t3.s>=400?'pass':'fail','PUT with no row_version -> '+SR(t3).slice(0,120)+'; stored points='+v3.entries[0].points+' (overwrites without any version check; same class as NDC-2868)');
const ghost=await api('DELETE','/scoring-rules/00000000-0000-0000-0000-000000000002'); const again=await api('DELETE','/scoring-rules/'+h); const again2=await api('DELETE','/scoring-rules/'+h);
RES('I3',ghost.s===404?'pass':'info','GET/PUT/PATCH on unknown id 404; DELETE unknown id '+ghost.s+'; delete twice '+again.s+'/'+again2.s+' (DELETE answers 204 for ids that do not exist; low)');
// I6 regex check detail
const rr=await mkRule(L,{name:P+'rx',entries:[ent('company','regexMatches','Acme.*',1)]}); const rx=keepRule(rr); const g2=rx&&(await api('GET','/scoring-rules/'+rx)).j.data; log('regex rule stored', JSON.stringify(g2&&g2.entries));
const a1=await newRec(L,{company:'Acme Ltd'}); log('regex Acme.* score', await recScore(L,a1)); I.regexRule=rx; SAVE();
