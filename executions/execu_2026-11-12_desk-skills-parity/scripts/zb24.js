const o={}; const CT='1475109000000529480', S3='1475109000000529159', TEST='1475109000000529026';
for(const id of ['1475109000000529696','1475109000000529735','1475109000000529774','1475109000000529873','1475109000000529959']){ const r=await z('PATCH',`/tickets/${id}`,{status:'Closed'}); o['c'+id.slice(-4)]=r.s; }
o.off=await z('PATCH',`/skillConfiguration`,{departmentId:DEPT,autoSkillStamping:'INACTIVE'}); o.off=[o.off.s,o.off.t.slice(0,150)];
const mk=async(subject,sk)=>{const r=await z('POST','/tickets',{subject,departmentId:DEPT,contactId:CT,entitySkills:sk}); return r.j?.id;};
const b1=await mk('QA SK12 B1 QASK12RR',[S3]);
const b2=await mk('QA SK12 B2 QASK12RR',[S3,TEST]);
const b3=await mk('QA SK12 B3 QASK12RR',[]);
await new Promise(x=>setTimeout(x,12000));
for(const [k,id] of [['B1',b1],['B2',b2],['B3',b3]]){const g=await z('GET',`/tickets/${id}`); o[k]=[id,g.j?.ticketNumber,g.j?.assigneeId,g.j?.entitySkills];}
o.on=await z('PATCH',`/skillConfiguration`,{departmentId:DEPT,autoSkillStamping:'ACTIVE',attachSkillsOption:'AT_THE_END'}); o.on=[o.on.s,o.on.t.slice(0,150)];
return o;
