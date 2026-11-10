const out={};
const r=await api('PUT',`/modules/${LEADS}/record-visibility`,{mode:'public_read_only'});out.put=r.s+' '+r.t.slice(0,300);
const m=(await api('GET',`/modules/${LEADS}`)).j.data;out.now=m.recordVisibility;
if(m.recordVisibility!=='hierarchy'){ids.leadsVisChanged=true;save();log(`SETTING Leads record visibility hierarchy → ${m.recordVisibility} (PUT /record-visibility ${r.s}); ORIGINAL "hierarchy" — restore right after the check`);}
else log(`TRY Leads record visibility → public_read_only: ${r.s} ${r.t.slice(0,120)}; stays hierarchy`);
return out;
