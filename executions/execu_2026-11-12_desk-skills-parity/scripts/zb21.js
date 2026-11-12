const o={}; const CT='1475109000000529480', S3='1475109000000529159', S1='1475109000000529139';
const mk=async(subject)=>{const r=await z('POST','/tickets',{subject,departmentId:DEPT,contactId:CT}); return r.j?.id;};
// auto on create now that threshold allows
const a4=await mk('QA SK12 A4 QASK12RR QASK12S1'); o.a4id=a4;
// none of agent skills: create w/o RR keyword, set entitySkills [S3] only, then add keyword via subject edit (update trigger)
const a5=await mk('QA SK12 A5 QASK12S3'); o.a5id=a5;
await new Promise(r=>setTimeout(r,8000));
o.a5set=await z('PATCH',`/tickets/${a5}`,{entitySkills:[S3]}); o.a5set=[o.a5set.s,o.a5set.j?.entitySkills,o.a5set.j?.assigneeId];
const ex=await z('POST',`/tickets/${a5}/executeSkillbasedAssignment`); o.a5exec=[ex.s,ex.t.slice(0,120)];
await new Promise(r=>setTimeout(r,8000));
for(const [k,id] of [['A4',a4],['A5',a5]]){const g=await z('GET',`/tickets/${id}`); o[k]=[g.j?.ticketNumber,g.j?.assigneeId,g.j?.entitySkills];}
return o;
