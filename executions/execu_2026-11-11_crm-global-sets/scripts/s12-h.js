let r=await api('POST','/global-sets/'+I.T+'/clone'); const c1=r.j&&r.j.data; if(c1){LED('set clone '+c1.name+' '+c1.id);I.CL1=c1.id;}
const t=await gs(I.T); RES('H1', c1&&c1.name==='QA GS1111 Tier_Cloned'&&c1.field_count===0?'Pass':'Fail', SR(r)+' name '+(c1&&c1.name)+'; values '+(c1&&c1.values.map(v=>v.value+(v.color?'('+v.color+')':''))).join('/')+' vs source '+t.values.map(v=>v.value+(v.color?'('+v.color+')':'')).join('/')+'; unused copied: '+(c1&&c1.unused_values.map(v=>v.value))+' (source unused '+t.unused_values.map(v=>v.value)+'); fields '+(c1&&c1.field_count));
r=await api('POST','/global-sets/'+I.T+'/clone'); const c2=r.j&&r.j.data; if(c2){LED('set clone '+c2.name+' '+c2.id);I.CL2=c2.id;} SAVE();
RES('H2', c2&&c2.name==='QA GS1111 Tier_Cloned_2'?'Pass':'Fail', SR(r)+' '+(c2&&c2.name));
// H3 convert local field
const L3local=await recVal(L,I.L3,'qa_gs1111_local');
r=await api('POST','/global-sets/from-field',{module_id:L,field_id:I.fLocal,name:'QA GS1111 Local Set',description:null}); const cv=r.j&&r.j.data; if(cv){I.LS=cv.id;SAVE();LED('set from field '+cv.id);}
const after=await recVal(L,I.L3,'qa_gs1111_local');
RES('H3', cv&&cv.values.map(v=>v.value).join()==='Gold,Platinum,Silver'&&cv.field_count===1&&after===L3local?'Pass':'Fail', SR(r)+' values '+(cv&&cv.values.map(v=>v.value))+' fields '+(cv&&cv.field_count)+'; L3 local '+L3local+' → '+after);
r=await api('POST','/global-sets/from-field',{module_id:L,field_id:I.fLocal,name:'QA GS1111 Local Set 2',description:null}); if(r.s<300){LED('set from field 2 '+r.j.data.id);(I.neg=I.neg||[]).push(r.j.data.id);SAVE();}
RES('H4', r.s>=400?'Pass':'Fail', 'convert an already linked field → '+SR(r));
// H5 delete a set with no fields (clone 2)
r=await api('DELETE','/global-sets/'+I.CL2); const gone=(await api('GET','/global-sets/'+I.CL2)).s; if(r.s<300)LED('DELETED set clone2 '+I.CL2);
RES('H5', r.s<300&&gone===404?'Pass':'Fail', 'delete → '+SR(r)+'; GET after → '+gone);
// H6 delete a set with a linked field (Local Set, 1 field, L3 has Platinum)
r=await api('DELETE','/global-sets/'+I.LS); const fl=await fieldOf(L,I.fLocal); const v3=await recVal(L,I.L3,'qa_gs1111_local'); if(r.s<300)LED('DELETED set Local Set '+I.LS);
RES('H6', r.s<300&&fl&&!fl.datatypeOptions.global_set_id&&fl.datatypeOptions.allowed_values.length===3&&v3==='Platinum'?'Pass':(r.s>=400?'Info':'Fail'), 'delete set with 1 linked field → '+SR(r)+'; field now gs='+(fl&&fl.datatypeOptions.global_set_id)+' allowed='+(fl&&fl.datatypeOptions.allowed_values)+'; L3 value '+v3+' (Zoho: field becomes local and keeps values)');
// H8 recycle bin
const bin=await api('GET','/recycle-bin?page=1&page_size=50'); const hit=JSON.stringify(bin.j||'').includes('QA GS1111 Tier_Cloned_2');
RES('H8','Info','recycle bin '+SR(bin)+' lists deleted set: '+hit);
return 'ok';
