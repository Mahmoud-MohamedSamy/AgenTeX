const o={}; const S2='1475109000000529149', T181='1475109000000570221', S3='1475109000000529159';
// delete a skill used on a ticket: S3 is on #181
const del=await z('DELETE',`/skills/${S3}`); o.delS3=[del.s,del.t.slice(0,300)];
await new Promise(r=>setTimeout(r,4000)); const g=await z('GET',`/tickets/${T181}`); o.after181=g.j?.entitySkills;
const rr=await z('GET',`/skills/${S2}/relatedRules`); o.related=[rr.s,rr.t.slice(0,300)];
return o;
