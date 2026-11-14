const out=[]; const R=(k,ok,f)=>{out.push(k+' '+(ok?'PASS':'FAIL')+' '+f); RES('2806-'+k,ok?'PASS':'FAIL',f);};
const mods=arr((await api('GET','/modules')).j.data); const cu=mods.find(m=>/^customers$/i.test(m.key||m.moduleKey||m.api_name||'')||/^Customers$/.test((m.labels&&m.labels.en)||m.label||m.name||'')); out.push('customers '+(cu&&cu.id));
I.CU=cu.id; SAVE();
await mkSet('QA RT17 GS Limit2',['A','B'],'SLIM2');
let n=0; for(const id of I.limF){const a=await api('POST','/global-sets/'+I.SLIM2+'/associate',{module_id:L,field_id:id,mappings:{}}); if(a.s===200)n++; else out.push('assoc '+SR(a));}
I.limC=I.limC||[]; for(let i=I.limC.length;i<7;i++){const x=await api('POST','/modules/'+I.CU+'/fields',{fields:[{fieldName:'qa_rt17_lim_c'+i,labels:{en:'QA RT17 LimC '+i},datatypeKey:'pick_list',datatypeOptions:{global_set_id:I.SLIM2},config:{}}]}); const id=fid(x); if(id){I.limC.push(id);LED('field Customers qa_rt17_lim_c'+i+' '+id);} else {out.push('c '+SR(x));break;}} SAVE();
const u=await api('GET','/global-sets/'+I.SLIM2+'/used-in'); const cnt=(u.j.data.fields||[]).length;
const rp=await api('POST','/global-sets/'+I.SLIM2+'/values/replace',{replacements:{A:'B'}}); const dl=await api('DELETE','/global-sets/'+I.SLIM2);
const x17=await api('POST','/modules/'+I.CU+'/fields',{fields:[{fieldName:'qa_rt17_lim_c7',labels:{en:'QA RT17 LimC 7'},datatypeKey:'pick_list',datatypeOptions:{global_set_id:I.SLIM2},config:{}}]}); const id17=fid(x17); if(id17){I.limC.push(id17);SAVE();LED('field Customers qa_rt17_lim_c7 '+id17);}
R('limit-15', cnt===16&&rp.s>=400&&dl.s>=400, 'linked '+n+' Leads + '+I.limC.length+' Customers = used-in '+cnt+'; replace → '+SR(rp)+'; delete → '+SR(dl)+'; 17th field → '+SR(x17));
return out;
