const o = {}; const S1='1475109000000529139';
o.map = await z('PATCH', `/skills/${S1}`, { agentIds: ['1475109000000139001','1475109000000486007'] }); o.map=[o.map.s, o.map.j?.agentIds, o.map.t.slice(0,200)];
const ag = await z('GET', `/agents/1475109000000486007`); o.agent=[ag.s, ag.j?.associatedDepartmentIds, ag.j?.status, ag.j?.isConfirmed, ag.j?.roleId];
const me = await z('GET', `/agents/1475109000000139001`); o.me=[me.s, me.j?.associatedDepartmentIds];
return o;
