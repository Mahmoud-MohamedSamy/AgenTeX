const o={}; const CT='1475109000000529480', S3='1475109000000529159', S1='1475109000000529139', TEST='1475109000000529026';
o.off=await z('PATCH',`/skillConfiguration?departmentId=${DEPT}`,{autoSkillStamping:'INACTIVE'}); o.off=[o.off.s,o.off.t.slice(0,150)];
const mk=async(subject,sk)=>{const r=await z('POST','/tickets',{subject,departmentId:DEPT,contactId:CT,entitySkills:sk}); return r.j?.id;};
const a7=await mk('QA SK12 A7 QASK12RR',[S3]);          // agent has none
const a8=await mk('QA SK12 A8 QASK12RR',[S3,TEST]);     // agent has 1 of 2 (lower priority one)
const a9=await mk('QA SK12 A9 QASK12RR',[]);            // no skills
await new Promise(x=>setTimeout(x,12000));
for(const [k,id] of [['A7',a7],['A8',a8],['A9',a9]]){const g=await z('GET',`/tickets/${id}`); o[k]=[id,g.j?.ticketNumber,g.j?.assigneeId,g.j?.entitySkills];}
o.on=await z('PATCH',`/skillConfiguration?departmentId=${DEPT}`,{autoSkillStamping:'ACTIVE',attachSkillsOption:'AT_THE_END'}); o.on=[o.on.s,o.on.t.slice(0,150)];
return o;
