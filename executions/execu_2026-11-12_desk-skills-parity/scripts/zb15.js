const o={}; const CT='1475109000000529480';
const mk=async(subject)=>{const r=await z('POST','/tickets',{subject,departmentId:DEPT,contactId:CT}); return r.j?.id;};
const ids={};
ids.A1=await mk('QA SK12 A1 QASK12RR QASK12S1');           // S1 (+test): Fathy has S1,test
ids.A2=await mk('QA SK12 A2 QASK12RR QASK12S3');           // S3 (+test): nobody has S3
ids.A3=await mk('QA SK12 A3 QASK12RR QASK12S1 QASK12S3');  // S1,S3,test
await new Promise(r=>setTimeout(r,15000));
for(const k in ids){const g=await z('GET',`/tickets/${ids[k]}`); o[k]=[ids[k],g.j?.ticketNumber,g.j?.assigneeId,g.j?.entitySkills];}
return o;
