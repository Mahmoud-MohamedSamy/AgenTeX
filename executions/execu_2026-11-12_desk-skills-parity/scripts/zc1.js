const all = await z('GET', `/tickets?departmentId=${DEPT}&limit=100&sortBy=-createdTime`);
const qa = (all.j?.data||[]).filter(t => /^QA SK12/.test(t.subject)).map(t => [t.id, t.ticketNumber, t.subject.slice(0,40), t.status]);
const sk = await z('GET', `/skills?departmentId=${DEPT}&limit=100`); const qs = (sk.j?.data||[]).map(s => [s.id, s.name.slice(0,30)]);
const sk2 = await z('GET', `/skills?departmentId=1475109000000006907&limit=100`); const qs2 = (sk2.j?.data||[]).map(s => [s.id, s.name]);
return { tickets: qa, techSkills: qs.length, techNonQA: qs.filter(s=>!/^QA SK12/.test(s[1])), haytham: qs2 };
