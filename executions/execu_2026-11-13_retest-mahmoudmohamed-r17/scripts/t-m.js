const out=[]; const R=(k,ok,f)=>{out.push(k+' '+(ok?'PASS':'FAIL')+' '+f); RES('2806-'+k,ok?'PASS':'FAIL',f);};
let r, g;
// convert local -> global with mapping
await mkLocal('qa_rt17_map',['Gold','Copper'],'fMap'); const lm=await mkRec('2806 Copper',{qa_rt17_map:'Copper'});
const pv=await api('GET','/global-sets/'+I.T+'/association-preview?module_id='+L+'&field_id='+I.fMap);
r=await api('POST','/global-sets/'+I.T+'/associate',{module_id:L,field_id:I.fMap,mappings:{Copper:'Gold'}}); const mv=await recVal(L,lm[1],'qa_rt17_map');
R('convert-map', r.s===200&&mv==='Gold', 'preview '+SR(pv)+' '+JSON.stringify(pv.j&&pv.j.data).slice(0,200)+'; associate Copper→Gold '+SR(r)+'; record now '+mv);
r=await api('POST','/global-sets/'+I.S68+'/associate',{module_id:L,field_id:I.fMap,mappings:{}}); R('second-set-refused', r.s===409, SR(r));
r=await api('POST','/global-sets/'+I.T+'/disassociate',{module_id:L,field_id:I.fMap}); const fm=await fieldOf(L,I.fMap); R('disassociate', r.s===200&&!fm.datatypeOptions.global_set_id&&(await recVal(L,lm[1],'qa_rt17_map'))==='Gold', SR(r)+' field now local '+fm.datatypeOptions.allowed_values);
// convert field to new set (from field properties) endpoint?
r=await api('POST','/global-sets/convert',{module_id:L,field_id:I.fMap,name:'QA RT17 GS converted'}); if(r.s<300){I.CONV=r.j.data.id||(r.j.data.set&&r.j.data.set.id);SAVE();LED('set QA RT17 GS converted '+I.CONV);} R('convert-new-set', r.s<300, SR(r)+' '+r.t.slice(0,160));
// clone
r=await api('POST','/global-sets/'+I.T+'/clone'); const c=r.j&&r.j.data; if(c){I.CL=c.id;SAVE();LED('set clone '+c.name+' '+c.id);} R('clone', r.s<300&&c&&/Cloned/i.test(c.name)&&c.values.length===(await gs(I.T)).values.length, SR(r)+' name '+(c&&c.name)+' values '+(c&&c.values.map(v=>v.value)));
// values: add, rename, reorder, colour -> field follows
g=await gs(I.CL); const base=x=>({name:x.name,description:x.description,colors_enabled:x.colors_enabled,values:x.values,row_version:x.row_version});
r=await api('PUT','/global-sets/'+I.T,{...base(await gs(I.T)),colors_enabled:true,values:(await gs(I.T)).values.concat([{label:'Platinum',color:'#E5E4E2'}])}); let f=await fieldOf(L,I.fT);
R('add-value-follows', r.s===200&&f.datatypeOptions.allowed_values.includes('Platinum'), SR(r)+' field '+f.datatypeOptions.allowed_values);
g=await gs(I.T); r=await api('PUT','/global-sets/'+I.T,{...base(g),values:[...g.values].reverse()}); f=await fieldOf(L,I.fT); g=await gs(I.T);
R('reorder-follows', r.s===200&&f.datatypeOptions.allowed_values.join()===g.values.map(v=>v.value).join(), 'set '+g.values.map(v=>v.value)+' field '+f.datatypeOptions.allowed_values);
// unused / restore
r=await api('POST','/global-sets/'+I.T+'/values/remove',{values:['Platinum']}); g=await gs(I.T); f=await fieldOf(L,I.fT); const rm=r.s; 
const pr=await mkRec('2806 Platinum unused',{qa_rt17_tier:'Platinum'});
r=await api('POST','/global-sets/'+I.T+'/values/restore',{values:['Platinum']}); g=await gs(I.T);
R('unused-restore', rm===200&&pr[0]>=400&&r.s===200&&g.values.some(v=>v.value==='Platinum'), 'remove '+rm+'; new record with unused value → '+pr[0]+'; restore '+SR(r));
// locked system fields
const fl=arr((await api('GET','/modules/'+L+'/fields')).j.data); const lk=[]; for(const n of ['lead_status','first_name']){const x=fl.find(y=>(y.fieldName||y.field_name)===n); if(!x) continue; const a=await api('POST','/global-sets/'+I.T+'/associate',{module_id:L,field_id:x.id,mappings:{}}); lk.push(n+'→'+SR(a));}
R('locked-fields', lk.length&&lk.every(s=>/→4/.test(s)), lk.join('; '));
// negatives on create
const neg=[]; for(const b of [{name:'',values:[{label:'A'}]},{name:'QA RT17 GS Tier',values:[{label:'A'}]},{name:'QA RT17 dupvals',values:[{label:'A'},{label:'A'}]}]){const x=await api('POST','/global-sets',b); neg.push(SR(x)); if(x.s<300)LED('set neg '+x.j.data.id);}
R('create-negatives', neg.every(s=>/^4/.test(s)), neg.join(' | '));
// permissions seeded
const perms=await api('GET','/iam/permissions'); const ks=[...new Set(JSON.stringify(perms.j).match(/crm:global_set:[a-z]+/g)||[])]; R('permissions-seeded', ks.includes('crm:global_set:view')&&ks.includes('crm:global_set:manage'), ks.join(', '));
// audit
const ev=await api('GET','/audit/events?entity_type=global_set&from=2026-11-13T00:00:00Z&limit=100'); const es=arr(ev.j&&ev.j.data); const mine=es.filter(e=>/QA RT17/.test(JSON.stringify(e)));
const acts=[...new Set(mine.map(e=>e.action||e.event_type||e.type))]; fs.writeFileSync(RUN+'/out/audit-2806.json',JSON.stringify(mine.slice(0,60),null,1));
R('audit', mine.length>5, SR(ev)+' events '+mine.length+' actions '+acts.join(','));
// delete clone (no fields) -> recycle bin
r=await api('DELETE','/global-sets/'+I.CL); if(r.s<300)LED('DELETED set clone '+I.CL); const gone=(await api('GET','/global-sets/'+I.CL)).s; R('delete-unused-set', r.s<300&&gone===404, SR(r)+' then GET '+gone);
r=await api('DELETE','/global-sets/'+I.T); R('delete-used-set-refused', r.s>=400, SR(r));
return out;
