const o={}; const T1='1475109000000529517', S1='1475109000000529139', S3='1475109000000529159', ME='1475109000000139001';
o.prefs=(await z('GET',`/skillConfiguration?departmentId=${DEPT}`)).j;
// unassign ticket, set S1 only, execute
o.p=await z('PATCH',`/tickets/${T1}`,{assigneeId:null,entitySkills:[S1]}); o.p=[o.p.s,o.p.j?.assigneeId,o.p.j?.entitySkills];
const r=await z('POST',`/tickets/${T1}/executeSkillbasedAssignment`); o.exec1=[r.s,r.t.slice(0,300)];
await new Promise(x=>setTimeout(x,5000)); const g=await z('GET',`/tickets/${T1}`); o.after1=[g.j?.assigneeId,g.j?.entitySkills];
o.p2=await z('PATCH',`/tickets/${T1}`,{assigneeId:null,entitySkills:[S1,S3]}); o.p2=[o.p2.s,o.p2.j?.assigneeId,o.p2.j?.entitySkills];
const r2=await z('POST',`/tickets/${T1}/executeSkillbasedAssignment`); o.exec2=[r2.s,r2.t.slice(0,300)];
await new Promise(x=>setTimeout(x,5000)); const g2=await z('GET',`/tickets/${T1}`); o.after2=[g2.j?.assigneeId,g2.j?.entitySkills];
return o;
