const o={}; const CT='1475109000000529480', S3='1475109000000529159';
const r=await z('POST','/tickets',{subject:'QA SK12 A6 QASK12S3',departmentId:DEPT,contactId:CT,entitySkills:[S3]}); o.create=[r.s,r.j?.id,r.j?.entitySkills,r.t.slice(0,150)];
await new Promise(x=>setTimeout(x,8000));
const id=r.j?.id; let g=await z('GET',`/tickets/${id}`); o.afterCreate=[g.j?.ticketNumber,g.j?.assigneeId,g.j?.entitySkills];
await z('PATCH',`/tickets/${id}`,{entitySkills:[S3]});
const u=await z('PATCH',`/tickets/${id}`,{subject:'QA SK12 A6 QASK12RR QASK12S3x'}); o.upd=[u.s,u.j?.entitySkills];
await new Promise(x=>setTimeout(x,10000)); g=await z('GET',`/tickets/${id}`); o.afterUpdate=[g.j?.assigneeId,g.j?.entitySkills];
return o;
