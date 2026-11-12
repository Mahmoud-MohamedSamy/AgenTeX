const T170='1475109000000529517', S1='1475109000000529139', INA='1475109000000529179', HS='1475109000000529613';
const p=await z('PATCH',`/tickets/${T170}`,{subject:'QA SK12 order (manual: S1 + inactive + other dept)',entitySkills:[S1,INA,HS]});
return [p.s,p.j?.entitySkills,(p.j?.skillsInfo||[]).map(s=>s.skillName)];
