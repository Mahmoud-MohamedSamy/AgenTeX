// E2E-4: replace blocked by view -> change the view -> replace works -> check rule action -> restore old value
const vw=(await api('GET','/modules/'+L+'/views/'+I.V)).j.data; const upd=await api('PUT','/modules/'+L+'/views/'+I.V,{...vw,settings:{...vw.settings,criteria:{pattern:null,conditions:[{field:'qa_gs1111_tier',operator:'equals',value:'Gold'}]}}});
const pv=await api('PATCH','/modules/'+L+'/views/'+I.V,{settings:{...vw.settings,criteria:{pattern:null,conditions:[{field:'qa_gs1111_tier',operator:'equals',value:'Gold'}]}}});
const v2=(await api('GET','/modules/'+L+'/views/'+I.V)).j.data.settings.criteria;
let r=await api('POST','/global-sets/'+I.T+'/values/replace',{replacements:{Silver:'Gold'}}); await sleep(2000);
const w=(await api('GET','/workflow/rules/'+I.W)).j.data; const l1=await recVal(L,I.L1,'qa_gs1111_tier'), c1=await recVal(I.C,I.C1,'qa_gs1111_tier'); let g=await gs(I.T);
RES('G3c', /Gold/.test(w.actions[0].fieldUpdates.qa_gs1111_tier.stringValue)?'Pass':'Fail', 'replace Silver→Gold (Silver only in the rule field update now) → '+SR(r)+'; rule field update now sets "'+w.actions[0].fieldUpdates.qa_gs1111_tier.stringValue+'" (Silver is in Unused). Zoho: field update follows the new value.');
const rs=await api('POST','/global-sets/'+I.T+'/values/restore',{values:['Silver']});
RES('E2E-4', upd.s<300||pv.s<300 ? (r.s===200&&l1==='Gold'&&c1==='Gold'&&rs.s===200?'Pass':'Fail'):'Blocked', 'view edit PUT '+upd.s+' / PATCH '+pv.s+' → criteria '+JSON.stringify(v2.conditions)+'; replace '+SR(r)+'; L1='+l1+' C1='+c1+'; restore Silver '+SR(rs)+'; set '+g.values.map(v=>v.value)+' unused '+g.unused_values.map(v=>v.value));
return 'ok';
