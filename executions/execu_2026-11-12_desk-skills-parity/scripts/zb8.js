const o={}; const S1='1475109000000529139', S2='1475109000000529149', S3='1475109000000529159', INA='1475109000000529179';
const mk=async(subject,extra={})=>{const r=await z('POST','/tickets',{subject,departmentId:DEPT,contact:{lastName:'QA SK12 Contact',email:'qa.sk12.contact@example.com'},...extra}); return r;};
// order: subject matches S1, S2, S3 and Inact; placement AT_THE_END; dept order now S3,S2,S1
const t1=await mk('QA SK12 order QASK12S1 QASK12S2 QASK12S3 QASK12Inact'); o.t1=[t1.s,t1.j?.id,t1.j?.ticketNumber,t1.t.slice(0,200)];
await new Promise(r=>setTimeout(r,6000));
if(t1.j?.id){ const g=await z('GET',`/tickets/${t1.j.id}?include=skills`); o.t1skills=[g.s, g.j?.entitySkills, g.j?.skills, Object.keys(g.j||{}).filter(k=>/skill/i.test(k))]; }
return o;
