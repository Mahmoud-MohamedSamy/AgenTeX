const out={}; const mk=async (w,n,cond)=>{ const r=await api(w,'POST',`/modules/${T.LEADS}/views`,{name:n,kind:'list',visibility:'private',settings:{criteria:{conditions:cond||[]}}}); if(r.j?.data?.id) ledger(`view ${r.j.data.id} "${n}" (Leads, ${w})`); return r.j?.data?.id||r.t.slice(0,200); };
out.last=await mk('o','QA RT r10 2098 last',[{field:'first_name',operator:'starts_with',value:'QA RT r10 2098'}]);
out.gone=await mk('o','QA RT r10 2098 gone');
out.foreign=await mk('u2','QA RT r10 2098 u2 private');
out.delGone=(await api('o','DELETE',`/modules/${T.LEADS}/views/${out.gone}`)).s;
return out;
