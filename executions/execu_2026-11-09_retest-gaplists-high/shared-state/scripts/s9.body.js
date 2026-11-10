const out={};
const m=(await api('GET',`/modules/${LEADS}`)).j.data;out.before={vis:m.recordVisibility,rv:m.rowVersion};ids.leadsVisBefore=m.recordVisibility;save();
const r=await api('PUT',`/modules/${LEADS}`,{recordVisibility:'public_read_only',rowVersion:m.rowVersion});out.put=r.s+' '+r.t.slice(0,300);
const m2=(await api('GET',`/modules/${LEADS}`)).j.data;out.after={vis:m2.recordVisibility,rv:m2.rowVersion};
if(m2.recordVisibility!==m.recordVisibility){ids.leadsVisChanged=true;save();log(`SETTING Leads module recordVisibility ${m.recordVisibility} → ${m2.recordVisibility} (PUT ${r.s}); ORIGINAL "${m.recordVisibility}" — restore`);}
else log(`TRY Leads recordVisibility → public_read_only: PUT ${r.s}, value stays "${m2.recordVisibility}" (no change)`);
return out;
