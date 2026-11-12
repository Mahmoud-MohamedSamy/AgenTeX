const sk = await z('GET', `/skills?departmentId=${DEPT}&limit=100`); const nm = i => (sk.j.data.find(s => s.id === i)||{}).name || i;
const o = {};
for (const [k, id] of [['A#187','1475109000000570924'],['B#188','1475109000000570973']]) { const t = await z('GET', `/tickets/${id}`); o[k] = { n: (t.j.entitySkills||[]).length, skills: (t.j.entitySkills||[]).map(nm) }; }
return o;
