const out={};
const get=async()=>arr((await api('o','GET',`/modules/${T.LEADS}/fields`)).j?.data).find(f=>f.apiName==='lead_status');
const ls=await get(); const orig=ls.datatypeOptions; out.origCount=orig.allowed_values.length; log('ORIG', JSON.stringify(orig));
const add=await api('o','PUT',`/modules/${T.LEADS}/fields/${ls.id}`,{labels:ls.labels,datatypeOptions:{...orig,allowed_values:[...orig.allowed_values,'QA RT r10 stale']},required:ls.required,unique:ls.unique,rowVersion:ls.rowVersion});
out.add=add.s+' '+(add.s>299?add.t.slice(0,300):''); if(add.s<300) ledger(`field lead_status (${ls.id}) option "QA RT r10 stale" added — restore allowed_values to the ${orig.allowed_values.length} originals`);
if(add.s<300){ const C=await X.lead('o','QA RT r10 2113 C stale',{lead_status:'QA RT r10 stale'}); out.C=C.s+' '+(C.j?.data?.id||C.t.slice(0,200));
  const ls2=await get(); const rem=await api('o','PUT',`/modules/${T.LEADS}/fields/${ls.id}`,{labels:ls2.labels,datatypeOptions:{...ls2.datatypeOptions,allowed_values:orig.allowed_values},required:ls2.required,unique:ls2.unique,rowVersion:ls2.rowVersion}); out.remove=rem.s+' '+(rem.s>299?rem.t.slice(0,300):'');
  const ls3=await get(); out.restored=JSON.stringify(ls3.datatypeOptions.allowed_values)===JSON.stringify(orig.allowed_values); }
return out;
