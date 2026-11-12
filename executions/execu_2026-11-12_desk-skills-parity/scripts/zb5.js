const o = {}; const S1='1475109000000529139', S2='1475109000000529149', S3='1475109000000529159';
const list = await z('GET', `/skills?departmentId=${DEPT}&limit=100`); const ids = (list.j?.data||[]).map(s=>s.id);
o.order = await z('POST', `/skills/order`, { departmentId: DEPT, skillIds: [S3, S2, S1, ...ids.filter(i=>![S1,S2,S3].includes(i))] }); o.order=[o.order.s, o.order.t.slice(0,300)];
const l2 = await z('GET', `/skills?departmentId=${DEPT}&limit=100`); o.after=(l2.j?.data||[]).map(s=>[s.name.slice(0,14), s.orderId]);
o.agentSkills = await z('GET', `/agents/1475109000000486007/skills?departmentIds=${DEPT}`); o.agentSkills=[o.agentSkills.s, o.agentSkills.t.slice(0,500)];
o.map = await z('PATCH', `/skills/${S1}`, { agentIds: ['1475109000000486007'] }); o.map=[o.map.s, o.map.j?.agentIds||o.map.t.slice(0,300)];
o.agentSkills2 = await z('GET', `/agents/1475109000000486007/skills?departmentIds=${DEPT}`); o.agentSkills2=[o.agentSkills2.s, o.agentSkills2.t.slice(0,500)];
return o;
