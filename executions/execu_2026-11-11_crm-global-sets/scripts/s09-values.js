let r=await api('POST','/global-sets/'+I.T+'/values/remove',{values:['Bronze']}); let g=await gs(I.T); const l2=await recVal(L,I.L2,'qa_gs1111_tier'); const fL=await fieldOf(L,I.fL);
RES('F1', r.s===200&&g.unused_values.some(v=>v.value==='Bronze')&&l2==='Bronze'?'Pass':'Fail', SR(r)+' unused='+g.unused_values.map(v=>v.value)+' L2='+l2+' field allowed='+fL.datatypeOptions.allowed_values.join('/'));
const nr=await api('POST','/modules/'+L+'/records',rec({first_name:'QA GS1111',last_name:'Lnew Bronze',qa_gs1111_tier:'Bronze'})); if(nr.s<300){const id=nr.j.data.id||nr.j.data.record.id;LED('record Lnew Bronze '+id);I.Lnew=id;SAVE();}
RES('F2-api', nr.s>=400?'Pass':'Fail','new record with unused value Bronze → '+SR(nr));
r=await api('POST','/global-sets/'+I.T+'/values/restore',{values:['Bronze']}); g=await gs(I.T);
RES('F3', r.s===200&&g.values.some(v=>v.value==='Bronze')?'Pass':'Fail', SR(r)+' values='+g.values.map(v=>v.value).join('/'));
// F4 on Big set: remove 60, restore 51 then 50
const big=await gs(I.Big); const sixty=big.values.slice(0,60).map(v=>v.value); await api('POST','/global-sets/'+I.Big+'/values/remove',{values:sixty});
const r51=await api('POST','/global-sets/'+I.Big+'/values/restore',{values:sixty.slice(0,51)}); const r50=await api('POST','/global-sets/'+I.Big+'/values/restore',{values:sixty.slice(0,50)});
RES('F4', r51.s>=400&&r50.s===200?'Pass':'Fail','restore 51 → '+SR(r51)+'; 50 → '+SR(r50));
// F5 permanent delete of an unused value: try plausible routes on a QA-only set
await api('POST','/global-sets/'+I.T+'/values/remove',{values:['Platinum']});
const tries=[]; for (const [m,p,b] of [['POST','/values/delete',{values:['Platinum']}],['DELETE','/values/Platinum',null],['POST','/values/purge',{values:['Platinum']}],['DELETE','/unused-values/Platinum',null]]) { const x=await api(m,'/global-sets/'+I.T+p,b||undefined); tries.push(m+' '+p+' → '+x.s); }
g=await gs(I.T); const putDrop=await api('PUT','/global-sets/'+I.T,{name:g.name,description:g.description,colors_enabled:g.colors_enabled,values:g.values,unused_values:[],row_version:g.row_version}); const g2=await gs(I.T);
RES('F5', g2.unused_values.some(v=>v.value==='Platinum')?'Gap':'Info', 'no delete route: '+tries.join('; ')+'; PUT with unused_values [] → '+SR(putDrop)+', Platinum still unused: '+g2.unused_values.some(v=>v.value==='Platinum')+' (Zoho deletes from Unused, one at a time)');
// F6 delete a value still in use via PUT dropping Gold
const g3=await gs(I.T); const drop=await api('PUT','/global-sets/'+I.T,{name:g3.name,description:g3.description,colors_enabled:g3.colors_enabled,values:g3.values.filter(v=>v.value!=='Gold'),row_version:g3.row_version}); const g4=await gs(I.T); const l3=await recVal(L,I.L3,'qa_gs1111_tier');
RES('F6','Info','PUT leaving Gold out → '+SR(drop)+'; Gold now in '+(g4.values.some(v=>v.value==='Gold')?'values':g4.unused_values.some(v=>v.value==='Gold')?'unused':'nowhere')+'; L3='+l3);
if(!g4.values.some(v=>v.value==='Gold')) await api('POST','/global-sets/'+I.T+'/values/restore',{values:['Gold']});
// F7 remove a value used by the workflow field update (Silver)
r=await api('POST','/global-sets/'+I.T+'/values/remove',{values:['Silver']}); RES('F7','Info','remove Silver (used by rule action + view) → '+SR(r));
if(r.s===200) await api('POST','/global-sets/'+I.T+'/values/restore',{values:['Silver']});
return (await gs(I.T)).values.map(v=>v.value+'='+v.label).join(', ')+' | unused '+(await gs(I.T)).unused_values.map(v=>v.value);
