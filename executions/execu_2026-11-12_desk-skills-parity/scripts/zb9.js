const o={}; const T1='1475109000000529517'; const S1='1475109000000529139', S2='1475109000000529149', S3='1475109000000529159', INA='1475109000000529179', TEST='1475109000000529026';
const g=await z('GET',`/tickets/${T1}`); o.contactId=g.j?.contactId; o.skillsInfo=g.j?.skillsInfo;
// manual set: inactive skill, reorder, 11 skills
const lim=['1475109000000529220','1475109000000529230','1475109000000529240','1475109000000529250','1475109000000529260','1475109000000529270','1475109000000529280','1475109000000529290'];
o.setInactive=await z('PATCH',`/tickets/${T1}`,{entitySkills:[INA]}); o.setInactive=[o.setInactive.s,o.setInactive.j?.entitySkills||o.setInactive.t.slice(0,250)];
o.reorder=await z('PATCH',`/tickets/${T1}`,{entitySkills:[S1,S2,S3]}); o.reorder=[o.reorder.s,o.reorder.j?.entitySkills||o.reorder.t.slice(0,250)];
o.ten=await z('PATCH',`/tickets/${T1}`,{entitySkills:[S1,S2,S3,...lim.slice(0,7)]}); o.ten=[o.ten.s,(o.ten.j?.entitySkills||[]).length||o.ten.t.slice(0,250)];
o.eleven=await z('PATCH',`/tickets/${T1}`,{entitySkills:[S1,S2,S3,...lim.slice(0,8)]}); o.eleven=[o.eleven.s,o.eleven.t.slice(0,300)];
o.otherDept=await z('PATCH',`/tickets/${T1}`,{entitySkills:[S1,'1475109000000529026']}); o.otherDept=[o.otherDept.s,o.otherDept.j?.entitySkills||o.otherDept.t.slice(0,250)];
o.empty=await z('PATCH',`/tickets/${T1}`,{entitySkills:[]}); o.empty=[o.empty.s,o.empty.j?.entitySkills];
await new Promise(r=>setTimeout(r,5000)); const g2=await z('GET',`/tickets/${T1}`); o.afterEmpty=g2.j?.entitySkills;
return o;
