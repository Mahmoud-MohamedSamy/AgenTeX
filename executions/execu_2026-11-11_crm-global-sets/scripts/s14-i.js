const mkF=async(mod,name,type,vals)=>{ const r=await api('POST','/modules/'+mod+'/fields',{fields:[{fieldName:name,labels:{en:name.toUpperCase().replace(/_/g,' ')},datatypeKey:type,datatypeOptions:{allowed_values:vals},config:{allowed_values:vals}}]}); const d=r.j&&r.j.data; const id=d&&(Array.isArray(d)?d[0].id:(d.fields?d.fields[0].id:d.id)); if(id) LED('field '+name+' '+id); return id; };
I.fMulti=await mkF(L,'qa_gs1111_multi','multi_select',['Gold','Silver']); I.fRadio=await mkF(L,'qa_gs1111_radio','radio_button',['Gold','Silver']); I.fMap=await mkF(L,'qa_gs1111_map','pick_list',['Gold','Silver','Copper']); SAVE();
const res=[]; for (const [k,f] of [['multi',I.fMulti],['radio',I.fRadio]]) { const a=await api('POST','/global-sets/'+I.T+'/associate',{module_id:L,field_id:f,mappings:{}}); res.push(k+'→'+SR(a)); }
RES('I3','Info', res.join('; ')+' (Zoho: multi-select cannot use a set — TAVI extra)');
const fl=arr((await api('GET','/modules/'+L+'/fields')).j.data); const lk=[]; for (const n of ['lead_status','approval_status','first_name']) { const f=fl.find(x=>x.fieldName===n); if(!f) continue; const a=await api('POST','/global-sets/'+I.T+'/associate',{module_id:L,field_id:f.id,mappings:{}}); lk.push(n+'→'+SR(a)); }
RES('I4', lk.every(x=>/→4/.test(x))?'Pass':'Fail', lk.join('; '));
const mr=await api('POST','/modules/'+L+'/records',rec({first_name:'QA GS1111',last_name:'Lmap Copper',qa_gs1111_map:'Copper'})); const mid=mr.j&&mr.j.data&&(mr.j.data.id||mr.j.data.record.id); if(mid){I.Lmap=mid;SAVE();LED('record Lmap Copper '+mid);}
const p=await api('GET','/global-sets/'+I.T+'/association-preview?module_id='+L+'&field_id='+I.fMap);
RES('I5', p.s===200?'Pass':'Fail', SR(p)+' '+JSON.stringify(p.j&&p.j.data).slice(0,400));
const no=await api('POST','/global-sets/'+I.T+'/associate',{module_id:L,field_id:I.fMap,mappings:{}});
const a=await api('POST','/global-sets/'+I.T+'/associate',{module_id:L,field_id:I.fMap,mappings:{Copper:'Gold'}}); const v=await recVal(L,I.Lmap,'qa_gs1111_map');
RES('I6', a.s===200&&v==='Gold'?'Pass':'Fail','associate without mapping (Copper has a record) → '+SR(no)+'; with Copper→Gold → '+SR(a)+'; record now '+v);
const other=await api('POST','/global-sets',{name:'QA GS1111 Other',values:[{label:'Gold'}]}); if(other.s<300){I.O=other.j.data.id;SAVE();LED('set Other '+I.O);}
const d9=await api('POST','/global-sets/'+I.O+'/associate',{module_id:L,field_id:I.fMap,mappings:{}}); RES('I9', d9.s===409?'Pass':'Fail','link a field already on Tier to another set → '+SR(d9));
const ds=await api('POST','/global-sets/'+I.T+'/disassociate',{module_id:L,field_id:I.fMap}); const f2=await fieldOf(L,I.fMap); const v2=await recVal(L,I.Lmap,'qa_gs1111_map');
RES('I8', ds.s===200&&!f2.datatypeOptions.global_set_id&&v2==='Gold'?'Pass':'Fail','disassociate → '+SR(ds)+'; field gs='+f2.datatypeOptions.global_set_id+' allowed='+f2.datatypeOptions.allowed_values+'; record '+v2);
return 'ok';
