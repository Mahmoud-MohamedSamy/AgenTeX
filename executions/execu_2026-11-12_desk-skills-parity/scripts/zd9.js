const F = '1475109000000139001', T = '1475109000000579027', o = {};
for (const [id, name] of [['1475109000000006907','Haytham'],[DEPT,'Tech']]) { const r = await z('GET', `/tickets?departmentId=${id}&assignee=${F}&status=Open,On Hold,Escalated&limit=100`); o[name] = (r.j?.data||[]).length; }
const ex = await z('POST', `/tickets/${T}/executeSkillbasedAssignment`); o.exec6 = [ex.s, ex.t.slice(0, 200)];
await new Promise(r => setTimeout(r, 6000));
const g = await z('GET', `/tickets/${T}`); o.at6 = [g.j?.ticketNumber, g.j?.assigneeId];
return o;
