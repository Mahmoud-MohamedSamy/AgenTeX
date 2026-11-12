const o={}; const T1='1475109000000529517', S1='1475109000000529139', S2='1475109000000529149';
o.set=await z('PATCH',`/tickets/${T1}`,{entitySkills:[S2]}); o.set=[o.set.s,o.set.j?.entitySkills, (o.set.j?.skillsInfo||[]).map(s=>[s.skillName,s.mappingType])];
const r=await z('POST',`/tickets/${T1}/recalculateSkills`); o.recalc=[r.s,(r.j?.skillsInfo||[]).map(s=>[s.skillName,s.mappingType])];
return o;
