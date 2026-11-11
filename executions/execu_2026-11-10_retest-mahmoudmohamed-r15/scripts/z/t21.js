const r = await __z('POST','/api/v1/tickets',{subject:'QA RT15 2794 team and agent ticket',departmentId:'1475109000000426945',contactId:'1475109000000541087'});
await new Promise(s=>setTimeout(s,15000)); const g = await __z('GET','/api/v1/tickets/'+r.j.id+'?include=team,assignee');
const h = await __z('GET','/api/v1/tickets/'+r.j.id+'/History?limit=20');
return { create: r.s+' '+r.j?.id+' #'+r.j?.ticketNumber+' assignee@create='+r.j?.assigneeId+' team@create='+r.j?.teamId, now: g.s+' assignee='+g.j?.assigneeId+' ('+(g.j?.assignee?.firstName||'')+' '+(g.j?.assignee?.lastName||'')+') team='+g.j?.teamId+' ('+(g.j?.team?.name||'')+')', hist: h.s+' '+h.t.slice(0,600) };
