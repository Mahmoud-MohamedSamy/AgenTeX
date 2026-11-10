const out={};
const r=await api('PUT',`/modules/${LEADS}/record-visibility`,{mode:'hierarchy'});out.put=r.s;
const m=(await api('GET',`/modules/${LEADS}`)).j.data;out.now=m.recordVisibility;
if(m.recordVisibility==='hierarchy'){ids.leadsVisRestored=true;save();log(`RESTORED Leads record visibility → hierarchy (${r.s}; verified)`);}
return out;
