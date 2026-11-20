async (page) => { EVAL
const a=await z('GET','/api/v1/tickets?assignee='+TA1+'&limit=50');const b=await z('GET','/api/v1/tickets?limit=100&departmentId='+DEPT+'&sortBy=-createdTime');
return {a:a.s+' '+(a.j?.data||[]).map(x=>x.ticketNumber+':'+x.status+':'+x.departmentId.slice(-4)).join(','),b:b.s+' '+(b.j?.data||[]).map(x=>x.ticketNumber+':'+x.status+':'+(x.assigneeId||'-').slice(-6)).join(',')};}
