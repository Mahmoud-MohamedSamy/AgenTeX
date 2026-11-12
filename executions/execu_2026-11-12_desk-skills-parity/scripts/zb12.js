const o={}; const T1='1475109000000529517', S1='1475109000000529139', S2='1475109000000529149', S3='1475109000000529159';
// make S2 criteria no longer match, then recalc on ticket
const s2=await z('GET',`/skills/${S2}`);
o.chg=await z('PATCH',`/skills/${S2}`,{criteria:{fieldConditions:[{fieldName:'Subject',fieldModule:'tickets',condition:'contains',value:['NOMATCHQASK12']}],pattern:'1'}}); o.chg=o.chg.s;
o.before=(await z('GET',`/tickets/${T1}`)).j?.entitySkills;
o.recalc=await z('POST',`/tickets/${T1}/recalculateSkills`); o.recalc=[o.recalc.s,o.recalc.t.slice(0,300)];
await new Promise(r=>setTimeout(r,6000)); o.after=(await z('GET',`/tickets/${T1}`)).j?.entitySkills;
// manual-only skill (added by hand, criteria no match) kept or removed by recalc?
return o;
