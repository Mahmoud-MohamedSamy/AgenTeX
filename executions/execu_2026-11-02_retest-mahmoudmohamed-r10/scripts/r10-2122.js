const out={}; const c=[{field:'first_name',operator:'starts_with',value:'QA RT r10 2122'},{field:'lead_status',operator:'is_not_empty'}];
for(const p of ['1 AND 2','1 And 2','1 OR 2','1 and 2','1 and 3']){ const r=await api('o','POST',`/modules/${T.LEADS}/views`,{name:'QA RT r10 2122 '+p,kind:'list',visibility:'private',settings:{criteria:{conditions:c,pattern:p}}}); out[p]=r.s+' '+(r.s<300?(r.j.data.settings?.criteria?.pattern):r.t.slice(0,160)); if(r.j?.data?.id) ledger(`view ${r.j.data.id} "QA RT r10 2122 ${p}"`); }
return out;
