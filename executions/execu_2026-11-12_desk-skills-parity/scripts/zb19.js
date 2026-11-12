const r=await z('GET',`/tickets?departmentId=${DEPT}&assignee=1475109000000139001&status=Open,On Hold&limit=50`); 
return [r.s, (r.j?.data||[]).map(t=>[t.ticketNumber,t.status,t.subject.slice(0,40)]), r.t.slice(0,200)];
