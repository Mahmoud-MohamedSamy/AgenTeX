const out=[]; const R=(k,ok,f)=>{out.push(k+' '+(ok?'PASS':'FAIL')+' '+f); RES('2806-'+k,ok?'PASS':'FAIL',f);};
let r=await api('POST','/global-sets/from-field',{module_id:L,field_id:I.fMap,name:'QA RT17 GS converted',description:null}); const cv=r.j&&r.j.data; if(cv){I.CONV=cv.id;SAVE();LED('set from field QA RT17 GS converted '+cv.id);}
const f=await fieldOf(L,I.fMap); R('convert-from-field', r.s<300&&f.datatypeOptions.global_set_id===I.CONV, SR(r)+' values '+(cv&&cv.values.map(v=>v.value))+'; field linked='+(f.datatypeOptions.global_set_id===I.CONV));
// 15-field limit
await mkSet('QA RT17 GS Limit',['A','B'],'SLIM'); I.limF=I.limF||[]; 
for(let i=I.limF.length;i<16;i++){const x=await api('POST','/modules/'+L+'/fields',{fields:[{fieldName:'qa_rt17_lim_'+i,labels:{en:'QA RT17 Lim '+i},datatypeKey:'pick_list',datatypeOptions:{global_set_id:I.SLIM},config:{}}]}); const id=fid(x); if(id){I.limF.push(id);LED('field Leads qa_rt17_lim_'+i+' '+id);} else {out.push('lim field '+i+' '+SR(x)); break;} } SAVE();
const g=await gs(I.SLIM); const u=await api('GET','/global-sets/'+I.SLIM+'/used-in');
const rp=await api('POST','/global-sets/'+I.SLIM+'/values/replace',{replacements:{A:'B'}}); const dl=await api('DELETE','/global-sets/'+I.SLIM);
R('limit-15', I.limF.length===16&&rp.s>=400&&dl.s>=400, 'fields linked '+I.limF.length+' (used-in '+(u.j.data.fields||[]).length+'); replace → '+SR(rp)+'; delete → '+SR(dl));
return out;
